package fr.esgi.tierlist.domain.port;

import fr.esgi.tierlist.domain.model.TierListLogo;

import java.util.Optional;

public interface TierListLogoDatasourcePort {
    Optional<TierListLogo> findById(Long id);
    TierListLogo save(TierListLogo tierListLogo);
    void deleteById(Long id);
}
