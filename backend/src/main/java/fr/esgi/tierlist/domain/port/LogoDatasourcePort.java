package fr.esgi.tierlist.domain.port;

import fr.esgi.tierlist.domain.model.Logo;

import java.util.List;
import java.util.Optional;

public interface LogoDatasourcePort {
    Logo save(Logo logo);
    Optional<Logo> findById(Long id);
    Optional<Logo> findByDomain(String domain);
    List<Logo> findAll();
    void deleteById(Long id);
    boolean existsByDomain(String domain);
}
