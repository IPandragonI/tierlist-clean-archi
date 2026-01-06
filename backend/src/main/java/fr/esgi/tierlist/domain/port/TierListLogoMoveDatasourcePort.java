package fr.esgi.tierlist.domain.port;

import fr.esgi.tierlist.domain.model.TierListLogoMove;

import java.util.Optional;

public interface TierListLogoMoveDatasourcePort {
    Optional<TierListLogoMove> findById(Long id);
    TierListLogoMove save(TierListLogoMove tierListLogoMove);
    void deleteById(Long id);
}
