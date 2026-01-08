package fr.esgi.tierlist.domain.port;

import fr.esgi.tierlist.domain.model.TierList;

import java.util.List;
import java.util.Optional;

public interface TierListDatasourcePort {
    List<TierList> findAll();
    Optional<TierList> findById(Long id);
    Optional<TierList> findByCreatorId(Long creatorId);
    List<TierList> findByCategoryId(Long categoryId);
    TierList save(TierList tierList);
    void deleteById(Long id);
}
