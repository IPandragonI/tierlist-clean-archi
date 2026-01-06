package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.model.Column;
import fr.esgi.tierlist.domain.port.ColumnDatasourcePort;
import fr.esgi.tierlist.infrastructure.persistence.mapper.ColumnMapper;
import fr.esgi.tierlist.infrastructure.persistence.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Transactional
public class ColumnJpaAdapter implements ColumnDatasourcePort {

    private final ColumnRepository columnRepository;

    @Override
    public Optional<Column> findById(Long id) {
        return columnRepository.findById(id).map(ColumnMapper::toDomain);
    }

    @Override
    public Column save(Column column) {
        var columnEntity = ColumnMapper.toEntity(column);
        var savedEntity = columnRepository.save(columnEntity);
        return ColumnMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        columnRepository.deleteById(id);
    }
}
