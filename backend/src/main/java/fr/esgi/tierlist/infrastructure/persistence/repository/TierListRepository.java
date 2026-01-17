package fr.esgi.tierlist.infrastructure.persistence.repository;

import fr.esgi.tierlist.infrastructure.persistence.entity.TierListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

public interface TierListRepository extends JpaRepository<TierListEntity, Long> {
    List<TierListEntity> findByCreatorId(Long creatorId);
    List<TierListEntity> findByCategoryId(Long categoryId);

    @NonNull
    @Query("SELECT DISTINCT t FROM TierListEntity t LEFT JOIN FETCH t.columns LEFT JOIN FETCH t.creator LEFT JOIN FETCH t.category WHERE t.id = :id")
    Optional<TierListEntity> findByIdWithColumns(@NonNull Long id);

    @NonNull
    @Query("SELECT t FROM TierListEntity t LEFT JOIN FETCH t.logos WHERE t.id = :id")
    Optional<TierListEntity> findByIdWithLogos(@NonNull Long id);

    @NonNull
    @EntityGraph(attributePaths = {"creator", "category"})
    Optional<TierListEntity> findById(@NonNull Long id);

    @NonNull
    @EntityGraph(attributePaths = {"creator", "category"})
    List<TierListEntity> findAll();
}