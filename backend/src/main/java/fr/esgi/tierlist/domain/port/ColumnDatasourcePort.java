package fr.esgi.tierlist.domain.port;

import fr.esgi.tierlist.domain.model.Column;

import java.util.Optional;

public interface ColumnDatasourcePort {
    Optional<Column> findById(Long id);
    Column save(Column column);
    void deleteById(Long id);
}
