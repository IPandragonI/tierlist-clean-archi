package fr.esgi.tierlist.infrastructure.persistence.mapper;

import fr.esgi.tierlist.domain.model.Logo;
import fr.esgi.tierlist.infrastructure.persistence.entity.LogoEntity;

import java.time.LocalDateTime;

public record LogoMapper() {

    public static Logo toDomain(LogoEntity entity) {
        Logo logo = new Logo();
        logo.setId(entity.getId());
        logo.setName(entity.getName());
        logo.setDomain(entity.getDomain());
        logo.setStoredUrl(entity.getStoredUrl());
        logo.setOriginalUrl(entity.getOriginalUrl());
        logo.setCreatedAt(entity.getCreatedAt());
        logo.setUpdatedAt(entity.getUpdatedAt());
        return logo;
    }

    public static LogoEntity toEntity(Logo logo) {
        LogoEntity entity = new LogoEntity();
        entity.setId(logo.getId());
        entity.setName(logo.getName());
        entity.setDomain(logo.getDomain());
        entity.setStoredUrl(logo.getStoredUrl());
        entity.setOriginalUrl(logo.getOriginalUrl());
        entity.setCreatedAt(logo.getCreatedAt());
        entity.setUpdatedAt(logo.getUpdatedAt());
        return entity;
    }

    public static void prepareEntityForUpdate(LogoEntity l) {
        LocalDateTime now = LocalDateTime.now();
        if (l.getCreatedAt() == null) l.setCreatedAt(now);
        l.setUpdatedAt(now);
    }
}
