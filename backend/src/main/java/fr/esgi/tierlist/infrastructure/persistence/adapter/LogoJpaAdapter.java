package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.model.Logo;
import fr.esgi.tierlist.domain.port.LogoDatasourcePort;
import fr.esgi.tierlist.infrastructure.persistence.mapper.LogoMapper;
import fr.esgi.tierlist.infrastructure.persistence.repository.LogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Transactional
public class LogoJpaAdapter implements LogoDatasourcePort {

    private final LogoRepository logoRepository;

    @Override
    public Optional<Logo> findById(Long id) {
        return logoRepository.findById(id).map(LogoMapper::toDomain);
    }

    @Override
    public Optional<Logo> findByDomain(String domain) {
        return logoRepository.findByDomain(domain).map(LogoMapper::toDomain);
    }

    @Override
    public List<Logo> findAll() {
        return logoRepository.findAll()
                .stream()
                .map(LogoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Logo save(Logo tierList) {
        var logoEntity = LogoMapper.toEntity(tierList);
        LogoMapper.prepareEntityForUpdate(logoEntity);
        var savedEntity = logoRepository.save(logoEntity);
        return LogoMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        logoRepository.deleteById(id);
    }

    @Override
    public boolean existsByDomain(String domain) {
        return logoRepository.existsByDomain(domain);
    }
}
