package fr.esgi.tierlist.domain.port;

import fr.esgi.tierlist.domain.model.TierListLogoMove;

import java.util.List;
import java.util.Optional;

public interface TierListLogoMoveDatasourcePort {
    Optional<TierListLogoMove> findById(Long id);
    TierListLogoMove save(TierListLogoMove tierListLogoMove);
    List<TierListLogoMove> findAllByTierListId(Long tierListId);
    void deleteById(Long id);
}
