package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.model.TierListLogo;
import fr.esgi.tierlist.domain.port.TierListLogoDatasourcePort;
import fr.esgi.tierlist.infrastructure.persistence.mapper.TierListLogoMapper;
import fr.esgi.tierlist.infrastructure.persistence.repository.TierListLogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Transactional
public class TierListLogoJpaAdapter implements TierListLogoDatasourcePort {

    private final TierListLogoRepository tierListLogoRepository;


    @Override
    public Optional<TierListLogo> findById(Long id) {
        return tierListLogoRepository.findById(id).map(TierListLogoMapper::toDomain);
    }

    @Override
    public TierListLogo save(TierListLogo tierListLogo) {
        var entity = TierListLogoMapper.toEntity(tierListLogo);
        var savedEntity = tierListLogoRepository.save(entity);
        return TierListLogoMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        tierListLogoRepository.deleteById(id);
    }
}
