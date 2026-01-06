package fr.esgi.tierlist.infrastructure.persistence.repository;

import fr.esgi.tierlist.infrastructure.persistence.entity.TierListLogoMoveEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TierListLogoMoveRepository extends JpaRepository<TierListLogoMoveEntity, Long> {
    List<TierListLogoMoveEntity> findAllByTierListId(Long tierListId);
}