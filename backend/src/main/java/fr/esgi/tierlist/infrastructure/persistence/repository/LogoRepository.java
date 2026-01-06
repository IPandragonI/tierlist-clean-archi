package fr.esgi.tierlist.infrastructure.persistence.repository;

import fr.esgi.tierlist.infrastructure.persistence.entity.LogoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LogoRepository extends JpaRepository<LogoEntity, Long> {
    Optional<LogoEntity> findByDomain(String domain);
    boolean existsByDomain(String domain);
}