package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.model.TierListLogoMove;
import fr.esgi.tierlist.domain.port.TierListLogoMoveDatasourcePort;
import fr.esgi.tierlist.infrastructure.persistence.mapper.TierListLogoMoveMapper;
import fr.esgi.tierlist.infrastructure.persistence.repository.TierListLogoMoveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Transactional
public class TierListLogoMoveJpaAdapter implements TierListLogoMoveDatasourcePort {

    private final TierListLogoMoveRepository tierListLogoMoveRepository;

    @Override
    public Optional<TierListLogoMove> findById(Long id) {
        return tierListLogoMoveRepository.findById(id).map(TierListLogoMoveMapper::toDomain);
    }

    @Override
    public TierListLogoMove save(TierListLogoMove tierListLogoMove) {
        var entity = TierListLogoMoveMapper.toEntity(tierListLogoMove);
        var savedEntity = tierListLogoMoveRepository.save(entity);
        return TierListLogoMoveMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        tierListLogoMoveRepository.deleteById(id);
    }
}
