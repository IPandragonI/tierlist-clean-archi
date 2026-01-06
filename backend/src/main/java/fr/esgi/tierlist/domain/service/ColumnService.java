package fr.esgi.tierlist.domain.service;

import fr.esgi.tierlist.application.form.ColumnForm;
import fr.esgi.tierlist.domain.model.Column;
import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.domain.port.ColumnDatasourcePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ColumnService {

    private final ColumnDatasourcePort columnDatasourcePort;

    public Column create(ColumnForm columnForm, TierList tierList) {
        Column column = new Column();
        column.setName(columnForm.getName());
        column.setPosition(columnForm.getPosition());
        column.setTierList(tierList);
        return columnDatasourcePort.save(column);
    }

    public List<Column> createAll(List<ColumnForm> columnForms, TierList tierList) {
        return columnForms.stream()
                .map(form -> create(form, tierList))
                .toList();
    }

    public Column findById(Long id) {
        return columnDatasourcePort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Column not found with id: " + id));
    }

    public Column update(Long id, ColumnForm columnForm, TierList tierList) {
        Column column = findById(id);
        column.setName(columnForm.getName());
        column.setPosition(columnForm.getPosition());
        column.setTierList(tierList);
        return columnDatasourcePort.save(column);
    }

    public List<Column> updateAll(List<ColumnForm> columnForms, TierList tierList) {
        return columnForms.stream()
                .map(form -> {
                    Column existingColumn = tierList.getColumns().stream()
                            .filter(col -> col.getName().equals(form.getName()))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Column not found with name: " + form.getName()));
                    return update(existingColumn.getId(), form, tierList);
                })
                .toList();
    }
}
