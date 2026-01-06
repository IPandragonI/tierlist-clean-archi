package fr.esgi.tierlist.infrastructure.persistence.repository;

import fr.esgi.tierlist.infrastructure.persistence.entity.ColumnEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColumnRepository extends JpaRepository<ColumnEntity, Long> {
}