package fr.esgi.tierlist.domain.service;

import fr.esgi.tierlist.application.form.LogoForm;
import fr.esgi.tierlist.domain.model.Logo;
import fr.esgi.tierlist.domain.port.LogoDatasourcePort;
import fr.esgi.tierlist.domain.port.LogoProviderPort;
import fr.esgi.tierlist.domain.port.ObjectStoragePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LogoService {
    private static final String BUCKET_NAME = "tierlist";
    private static final String CONTENT_TYPE = "image/png";

    private final LogoDatasourcePort logoDatasourcePort;
    private final LogoProviderPort logoProviderPort;
    private final ObjectStoragePort objectStoragePort;


    public Logo getOrCreate(String domain) {
        String normalizedDomain = normalizeDomain(domain);

        Optional<Logo> existingLogo = logoDatasourcePort.findByDomain(normalizedDomain);
        if (existingLogo.isPresent()) {
            return existingLogo.get();
        }

        List<Logo> existingLogoByName = logoDatasourcePort.findByName(normalizedDomain);
        if (!existingLogoByName.isEmpty()) {
            return existingLogoByName.getFirst();
        }

        InputStream logoStream = logoProviderPort.fetchLogoByDomain(normalizedDomain)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Logo not found for domain: " + normalizedDomain));

        byte[] logoBytes;
        try {
            logoBytes = readAllBytes(logoStream);
            logoStream.close();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read logo stream", e);
        }

        String objectName = "logos/" + normalizedDomain + ".png";
        String storedUrl;

        try (ByteArrayInputStream byteStream = new ByteArrayInputStream(logoBytes)) {
            storedUrl = objectStoragePort.uploadFile(
                    BUCKET_NAME,
                    objectName,
                    byteStream,
                    CONTENT_TYPE,
                    logoBytes.length
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload logo to storage", e);
        }

        Logo logo = new Logo();
        logo.setName(extractCompanyName(normalizedDomain));
        logo.setDomain(normalizedDomain);
        logo.setStoredUrl(storedUrl);
        logo.setOriginalUrl(logoProviderPort.generateLogoUrl(normalizedDomain));
        logo.setCreatedAt(LocalDateTime.now());
        logo.setUpdatedAt(LocalDateTime.now());

        return logoDatasourcePort.save(logo);
    }

    public List<Logo> getOrCreateAll(List<LogoForm> logoForms) {
        return logoForms.stream()
                .map(form -> getOrCreate(form.getDomain()))
                .toList();
    }

    public Logo findById(Long id) {
        Logo logo = logoDatasourcePort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Logo not found with id: " + id));

        if (logo.getStoredUrl() != null && !logo.getStoredUrl().contains("X-Amz-")) {
            String objectName = "logos/" + logo.getDomain() + ".png";
            String newUrl = objectStoragePort.generatePresignedUrl(BUCKET_NAME, objectName, 7 * 24 * 60 * 60);
            logo.setStoredUrl(newUrl);
            logoDatasourcePort.save(logo);
        }

        return logo;
    }

    public Optional<Logo> getByDomain(String domain) {
        String normalizedDomain = normalizeDomain(domain);
        return logoDatasourcePort.findByDomain(normalizedDomain);
    }

    public List<Logo> findByDomainLike(String domain) {
        String normalizedDomain = normalizeDomain(domain);
        return logoDatasourcePort.findByDomainLike(normalizedDomain);
    }

    public List<Logo> findAll() {
        return logoDatasourcePort.findAll();
    }

    public List<Logo> findByName(String name) {
        return logoDatasourcePort.findAll().stream()
                .filter(logo -> logo.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
    }

    public void delete(Long id) {
        Logo logo = findById(id);

        if (logo.getStoredUrl() != null && !logo.getStoredUrl().isEmpty()) {
            String objectName = "logos/" + logo.getDomain() + ".png";
            objectStoragePort.deleteFile(BUCKET_NAME, objectName);
        }

        logoDatasourcePort.deleteById(id);
    }

    public Logo refresh(String domain) {
        String normalizedDomain = normalizeDomain(domain);

        logoDatasourcePort.findByDomain(normalizedDomain).ifPresent(logo -> delete(logo.getId()));

        return getOrCreate(normalizedDomain);
    }

    public List<Logo> refreshAll(List<LogoForm> logoForms) {
        return logoForms.stream()
                .map(form -> refresh(form.getDomain()))
                .toList();
    }

    private String normalizeDomain(String domain) {
        if (domain == null || domain.isEmpty()) {
            throw new IllegalArgumentException("Domain cannot be null or empty");
        }

        return domain.toLowerCase()
                .replaceAll("^https?://", "")
                .replaceAll("^www\\.", "")
                .replaceAll("/.*$", "")
                .trim();
    }

    private String extractCompanyName(String domain) {
        String name = domain.split("\\.")[0];
        return name.substring(0, 1).toUpperCase() + name.substring(1);
    }

    private byte[] readAllBytes(InputStream inputStream) throws Exception {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[8192];
        int nRead;
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        return buffer.toByteArray();
    }
}
