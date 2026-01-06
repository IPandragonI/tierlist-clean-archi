package fr.esgi.tierlist.infrastructure.persistence.mapper;

import fr.esgi.tierlist.domain.model.Column;
import fr.esgi.tierlist.domain.model.Logo;
import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.infrastructure.persistence.entity.ColumnEntity;
import fr.esgi.tierlist.infrastructure.persistence.entity.LogoEntity;
import fr.esgi.tierlist.infrastructure.persistence.entity.TierListEntity;

import java.util.List;

public record TierListMapper() {

    public static TierList toDomain(TierListEntity t) {
        if (t == null) return null;
        TierList tierList = new TierList();
        tierList.setId(t.getId());
        tierList.setName(t.getName());
        List<Column> columns = t.getColumns().stream().map(ColumnMapper::toDomain).toList();
        tierList.setColumns(columns);
        List<Logo> logo = t.getLogos().stream().map(LogoMapper::toDomain).toList();
        tierList.setLogos(logo);
        tierList.setCreator(UserMapper.toDomain(t.getCreator()));
        tierList.setCreatedAt(t.getCreatedAt());
        tierList.setUpdatedAt(t.getUpdatedAt());
        return tierList;
    }

    public static TierListEntity toEntity(TierList t) {
        if (t == null) return null;
        TierListEntity tierListEntity = new TierListEntity();
        tierListEntity.setId(t.getId());
        tierListEntity.setName(t.getName());
        List<ColumnEntity> columns = t.getColumns().stream().map(ColumnMapper::toEntity).toList();
        tierListEntity.setColumns(columns);
        List<LogoEntity> logo = t.getLogos().stream().map(LogoMapper::toEntity).toList();
        tierListEntity.setLogos(logo);
        tierListEntity.setCreator(UserMapper.toEntity(t.getCreator()));
        tierListEntity.setCreatedAt(t.getCreatedAt());
        tierListEntity.setUpdatedAt(t.getUpdatedAt());
        return tierListEntity;
    }
}
