package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.domain.port.TierListDatasourcePort;
import fr.esgi.tierlist.infrastructure.persistence.mapper.CategoryMapper;
import fr.esgi.tierlist.infrastructure.persistence.mapper.ColumnMapper;
import fr.esgi.tierlist.infrastructure.persistence.mapper.TierListMapper;
import fr.esgi.tierlist.infrastructure.persistence.repository.TierListRepository;
import fr.esgi.tierlist.infrastructure.persistence.repository.LogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Transactional
public class TierListJpaAdapter implements TierListDatasourcePort {

    private final TierListRepository tierListRepository;
    private final LogoRepository logoRepository;

    @Override
    public List<TierList> findAll() {
        var allEntities = tierListRepository.findAll();

        return allEntities.stream()
                .map(entity -> {
                    tierListRepository.findByIdWithColumns(entity.getId())
                        .ifPresent(e -> entity.setColumns(e.getColumns()));
                    tierListRepository.findByIdWithLogos(entity.getId())
                        .ifPresent(e -> entity.setLogos(e.getLogos()));
                    return TierListMapper.toDomain(entity);
                })
                .toList();
    }

    @Override
    public Optional<TierList> findById(Long id) {
        var entityWithColumns = tierListRepository.findByIdWithColumns(id);
        if (entityWithColumns.isEmpty()) {
            return Optional.empty();
        }

        var entityWithLogos = tierListRepository.findByIdWithLogos(id);
        if (entityWithLogos.isPresent()) {
            var entity = entityWithColumns.get();
            entity.setLogos(entityWithLogos.get().getLogos());
        }

        return entityWithColumns.map(TierListMapper::toDomain);
    }

    @Override
    public List<TierList> findByCreatorId(Long creatorId) {
        return tierListRepository.findByCreatorId(creatorId)
                .stream()
                .map(TierListMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<TierList> findByCategoryId(Long categoryId) {
        return tierListRepository.findByCategoryId(categoryId).stream()
                .map(TierListMapper::toDomain)
                .toList();
    }

    @Override
    public TierList save(TierList tierList) {
        if (tierList.getId() != null) {
            var existingEntity = tierListRepository.findById(tierList.getId())
                    .orElseThrow(() -> new IllegalArgumentException("TierList not found with id: " + tierList.getId()));

            existingEntity.setName(tierList.getName());
            existingEntity.setCategory(tierList.getCategory() != null ?
                    CategoryMapper.toEntity(tierList.getCategory()) : null);

            if (tierList.getColumns() != null) {
                existingEntity.getColumns().clear();
                tierList.getColumns().forEach(column -> {
                    var columnEntity = ColumnMapper.toEntity(column);
                    columnEntity.setTierList(existingEntity);
                    existingEntity.getColumns().add(columnEntity);
                });
            }

            if (tierList.getLogos() != null) {
                existingEntity.getLogos().clear();
                tierList.getLogos().forEach(logo -> {
                    var logoEntity = logoRepository.findById(logo.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Logo not found with id: " + logo.getId()));
                    existingEntity.getLogos().add(logoEntity);
                });
            }

            var savedEntity = tierListRepository.save(existingEntity);
            return TierListMapper.toDomain(savedEntity);
        } else {
            var tierListEntity = TierListMapper.toEntity(tierList);

            if (tierListEntity.getColumns() != null) {
                tierListEntity.getColumns().forEach(column -> column.setTierList(tierListEntity));
            }

            if (tierList.getLogos() != null && !tierList.getLogos().isEmpty()) {
                var logoEntities = tierList.getLogos().stream()
                        .map(logo -> logoRepository.findById(logo.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Logo not found with id: " + logo.getId())))
                        .toList();
                tierListEntity.setLogos(logoEntities);
            }

            var savedEntity = tierListRepository.save(tierListEntity);
            return TierListMapper.toDomain(savedEntity);
        }
    }

    @Override
    public void deleteById(Long id) {
        tierListRepository.deleteById(id);
    }
}
