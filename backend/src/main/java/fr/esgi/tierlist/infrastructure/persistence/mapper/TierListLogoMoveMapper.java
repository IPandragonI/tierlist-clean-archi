package fr.esgi.tierlist.infrastructure.persistence.mapper;

import fr.esgi.tierlist.domain.model.TierListLogoMove;
import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.infrastructure.persistence.entity.TierListLogoMoveEntity;
import fr.esgi.tierlist.infrastructure.persistence.entity.TierListEntity;

public record TierListLogoMoveMapper() {

    public static TierListLogoMove toDomain(TierListLogoMoveEntity entity) {
        if (entity == null) return null;
        TierListLogoMove tierListLogoMove = new TierListLogoMove();
        tierListLogoMove.setId(entity.getId());

        tierListLogoMove.setTierList(toDomainLight(entity.getTierList()));
        tierListLogoMove.setLogo(LogoMapper.toDomain(entity.getLogo()));
        tierListLogoMove.setUser(UserMapper.toDomain(entity.getUser()));
        tierListLogoMove.setColumn(ColumnMapper.toDomain(entity.getColumn()));
        tierListLogoMove.setCreatedAt(entity.getCreatedAt());
        return tierListLogoMove;
    }

    private static TierList toDomainLight(TierListEntity entity) {
        if (entity == null) return null;
        TierList tierList = new TierList();
        tierList.setId(entity.getId());
        tierList.setName(entity.getName());
        return tierList;
    }

    public static TierListLogoMoveEntity toEntity(TierListLogoMove tierListLogoMove) {
        if (tierListLogoMove == null) return null;
        TierListLogoMoveEntity entity = new TierListLogoMoveEntity();
        entity.setId(tierListLogoMove.getId());

        if (tierListLogoMove.getTierList() != null) {
            TierListEntity tierListEntity = new TierListEntity();
            tierListEntity.setId(tierListLogoMove.getTierList().getId());
            entity.setTierList(tierListEntity);
        }

        entity.setLogo(LogoMapper.toEntity(tierListLogoMove.getLogo()));
        entity.setUser(UserMapper.toEntity(tierListLogoMove.getUser()));
        entity.setColumn(ColumnMapper.toEntity(tierListLogoMove.getColumn()));
        entity.setCreatedAt(tierListLogoMove.getCreatedAt());
        return entity;
    }
}