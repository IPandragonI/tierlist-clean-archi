package fr.esgi.tierlist.infrastructure.persistence.mapper;

import fr.esgi.tierlist.domain.model.Column;
import fr.esgi.tierlist.domain.model.Logo;
import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.infrastructure.persistence.entity.ColumnEntity;
import fr.esgi.tierlist.infrastructure.persistence.entity.LogoEntity;
import fr.esgi.tierlist.infrastructure.persistence.entity.TierListEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public record TierListMapper() {

    public static TierList toDomain(TierListEntity t) {
        if (t == null) return null;
        TierList tierList = new TierList();
        tierList.setId(t.getId());
        tierList.setName(t.getName());

        List<Column> columns = t.getColumns() != null ?
                t.getColumns().stream()
                        .map(ColumnMapper::toDomain)
                        .collect(Collectors.toCollection(ArrayList::new))
                : new ArrayList<>();
        tierList.setColumns(columns);

        List<Logo> logos = t.getLogos() != null ?
                t.getLogos().stream()
                        .map(LogoMapper::toDomain)
                        .collect(Collectors.toCollection(ArrayList::new))
                : new ArrayList<>();
        tierList.setLogos(logos);

        tierList.setCreator(UserMapper.toDomain(t.getCreator()));
        tierList.setCategory(CategoryMapper.toDomain(t.getCategory()));
        tierList.setCreatedAt(t.getCreatedAt());
        tierList.setUpdatedAt(t.getUpdatedAt());
        return tierList;
    }

    public static TierListEntity toEntity(TierList t) {
        if (t == null) return null;
        TierListEntity tierListEntity = new TierListEntity();
        tierListEntity.setId(t.getId());
        tierListEntity.setName(t.getName());

        List<ColumnEntity> columns = t.getColumns() != null ?
                t.getColumns().stream()
                        .map(column -> {
                            ColumnEntity columnEntity = ColumnMapper.toEntity(column);
                            columnEntity.setTierList(tierListEntity);
                            return columnEntity;
                        })
                        .collect(Collectors.toCollection(ArrayList::new))
                : new ArrayList<>();
        tierListEntity.setColumns(columns);

        List<LogoEntity> logos = t.getLogos() != null ?
                t.getLogos().stream()
                        .map(LogoMapper::toEntity)
                        .collect(Collectors.toCollection(ArrayList::new))
                : new ArrayList<>();
        tierListEntity.setLogos(logos);

        tierListEntity.setCreator(UserMapper.toEntity(t.getCreator()));
        tierListEntity.setCategory(CategoryMapper.toEntity(t.getCategory()));
        tierListEntity.setCreatedAt(t.getCreatedAt());
        tierListEntity.setUpdatedAt(t.getUpdatedAt());
        return tierListEntity;
    }
}