package fr.esgi.tierlist.infrastructure.persistence.mapper;

import fr.esgi.tierlist.domain.model.TierListLogo;
import fr.esgi.tierlist.infrastructure.persistence.entity.TierListLogoEntity;

public record TierListLogoMapper() {

    public static TierListLogo toDomain(TierListLogoEntity entity) {
        if (entity == null) return null;
        TierListLogo tierListLogo = new TierListLogo();
        tierListLogo.setId(entity.getId());
        tierListLogo.setTierList(TierListMapper.toDomain(entity.getTierList()));
        tierListLogo.setLogo(LogoMapper.toDomain(entity.getLogo()));
        tierListLogo.setUser(UserMapper.toDomain(entity.getUser()));
        tierListLogo.setColumn(ColumnMapper.toDomain(entity.getColumn()));
        tierListLogo.setCreatedAt(entity.getCreatedAt());
        tierListLogo.setUpdatedAt(entity.getUpdatedAt());
        return tierListLogo;
    }

    public static TierListLogoEntity toEntity(TierListLogo tierListLogo) {
        if (tierListLogo == null) return null;
        TierListLogoEntity entity = new TierListLogoEntity();
        entity.setId(tierListLogo.getId());
        entity.setTierList(TierListMapper.toEntity(tierListLogo.getTierList()));
        entity.setLogo(LogoMapper.toEntity(tierListLogo.getLogo()));
        entity.setUser(UserMapper.toEntity(tierListLogo.getUser()));
        entity.setColumn(ColumnMapper.toEntity(tierListLogo.getColumn()));
        entity.setCreatedAt(tierListLogo.getCreatedAt());
        entity.setUpdatedAt(tierListLogo.getUpdatedAt());
        return entity;
    }
}
