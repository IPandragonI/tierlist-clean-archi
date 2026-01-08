package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.infrastructure.persistence.mapper.TierListMapper;
import fr.esgi.tierlist.domain.port.TierListDatasourcePort;
import fr.esgi.tierlist.infrastructure.persistence.repository.TierListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional
public class TierListJpaAdapter implements TierListDatasourcePort {

    private final TierListRepository tierListRepository;

    @Override
    public List<TierList> findAll() {
        return tierListRepository.findAll().stream()
                .map(TierListMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<TierList> findById(Long id) {
        return tierListRepository.findById(id).map(TierListMapper::toDomain);
    }

    @Override
    public Optional<TierList> findByCreatorId(Long creatorId) {
        return tierListRepository.findByCreatorId(creatorId).map(TierListMapper::toDomain);
    }

    @Override
    public List<TierList> findByCategoryId(Long categoryId) {
        return tierListRepository.findByCategoryId(categoryId).stream()
                .map(TierListMapper::toDomain)
                .toList();
    }

    @Override
    public TierList save(TierList tierList) {
        var tierListEntity = TierListMapper.toEntity(tierList);
        var savedEntity = tierListRepository.save(tierListEntity);
        return TierListMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        tierListRepository.deleteById(id);
    }
}
