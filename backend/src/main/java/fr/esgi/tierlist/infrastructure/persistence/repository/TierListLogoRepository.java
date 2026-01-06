package fr.esgi.tierlist.infrastructure.persistence.repository;

import fr.esgi.tierlist.infrastructure.persistence.entity.TierListLogoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TierListLogoRepository extends JpaRepository<TierListLogoEntity, Long> {
}