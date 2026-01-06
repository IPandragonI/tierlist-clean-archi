package fr.esgi.tierlist.domain.port;

import java.io.InputStream;
import java.util.Optional;

public interface LogoProviderPort {
    Optional<InputStream> fetchLogoByDomain(String domain);
    String generateLogoUrl(String domain);
}