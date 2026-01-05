package fr.esgi.tierlist.repository;

import fr.esgi.tierlist.business.TierList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TierListRepository extends JpaRepository<TierList, Long> {
}