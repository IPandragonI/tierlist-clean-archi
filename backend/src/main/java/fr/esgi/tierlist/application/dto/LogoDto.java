package fr.esgi.tierlist.application.dto;

import fr.esgi.tierlist.domain.model.Logo;

import java.io.Serializable;
import java.time.LocalDateTime;

public record LogoDto(Long id, String name, String domain, String storedUrl, String originalUrl,
                      LocalDateTime createdAt, LocalDateTime updatedAt) implements Serializable {

    public static LogoDto transfer(Logo logo) {
        return new LogoDto(
                logo.getId(),
                logo.getName(),
                logo.getDomain(),
                logo.getStoredUrl(),
                logo.getOriginalUrl(),
                logo.getCreatedAt(),
                logo.getUpdatedAt()
        );
    }
}
