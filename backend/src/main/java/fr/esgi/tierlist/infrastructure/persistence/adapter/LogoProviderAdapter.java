package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.port.LogoProviderPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Optional;

@Component
public class LogoProviderAdapter implements LogoProviderPort {

    @Value("${logo.token}")
    private String logoToken;

    private static final String LOGO_DEV_API_URL = "https://img.logo.dev";

    @Override
    public Optional<InputStream> fetchLogoByDomain(String domain) {
        try {
            String logoUrl = generateLogoUrl(domain);
            URL url = new URL(logoUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                return Optional.of(connection.getInputStream());
            } else {
                return Optional.empty();
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch logo for domain: " + domain + " - " + e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public String generateLogoUrl(String domain) {
        return String.format("%s/%s?token=%s&size=400", LOGO_DEV_API_URL, domain, logoToken);
    }
}