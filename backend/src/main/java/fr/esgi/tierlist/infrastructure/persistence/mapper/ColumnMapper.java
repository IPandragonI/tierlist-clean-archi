package fr.esgi.tierlist.infrastructure.persistence.mapper;

import fr.esgi.tierlist.domain.model.Column;
import fr.esgi.tierlist.infrastructure.persistence.entity.ColumnEntity;

public record ColumnMapper() {

    public static Column toDomain(ColumnEntity entity) {
        if (entity == null) return null;
        Column column = new Column();
        column.setId(entity.getId());
        column.setName(entity.getName());
        column.setTierList(TierListMapper.toDomain(entity.getTierList()));
        column.setPosition(entity.getPosition());
        column.setCreatedAt(entity.getCreatedAt());
        column.setUpdatedAt(entity.getUpdatedAt());
        return column;
    }

    public static ColumnEntity toEntity(Column column) {
        if (column == null) return null;
        ColumnEntity entity = new ColumnEntity();
        entity.setId(column.getId());
        entity.setName(column.getName());
        entity.setTierList(TierListMapper.toEntity(column.getTierList()));
        entity.setPosition(column.getPosition());
        entity.setCreatedAt(column.getCreatedAt());
        entity.setUpdatedAt(column.getUpdatedAt());
        return entity;
    }
}
