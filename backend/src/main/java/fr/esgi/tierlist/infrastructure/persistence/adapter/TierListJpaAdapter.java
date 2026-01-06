package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.infrastructure.persistence.mapper.TierListMapper;
import fr.esgi.tierlist.domain.port.TierListDatasourcePort;
import fr.esgi.tierlist.infrastructure.persistence.repository.TierListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Transactional
public class TierListJpaAdapter implements TierListDatasourcePort {

    private final TierListRepository tierListRepository;

    @Override
    public Optional<TierList> findById(Long id) {
        return tierListRepository.findById(id).map(TierListMapper::toDomain);
    }

    @Override
    public TierList save(TierList tierList) {
        var tierListEntity = TierListMapper.toEntity(tierList);
        TierListMapper.prepareForSave(tierListEntity);
        var savedEntity = tierListRepository.save(tierListEntity);
        return TierListMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        tierListRepository.deleteById(id);
    }
}
