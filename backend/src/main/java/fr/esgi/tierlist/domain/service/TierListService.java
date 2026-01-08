package fr.esgi.tierlist.domain.service;

import fr.esgi.tierlist.domain.model.*;
import fr.esgi.tierlist.application.form.TierListForm;
import fr.esgi.tierlist.domain.port.TierListDatasourcePort;
import fr.esgi.tierlist.infrastructure.security.IAuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TierListService {

    private final TierListDatasourcePort tierListDatasourcePort;
    private final ColumnService columnService;
    private final LogoService logoService;
    private final CategoryService categoryService;
    private final IAuthenticationFacade authenticationFacade;

    public TierList create(TierListForm tierListform) {
        User currentUser = authenticationFacade.getCurrentUser();
        if (currentUser == null) {
            throw new IllegalStateException("No authenticated user found");
        }

        TierList tierList = new TierList();
        tierList.setName(tierListform.getName());
        tierList.setCreator(currentUser);
        tierList.setColumns(new ArrayList<>());
        tierList.setLogos(new ArrayList<>());

        if (tierListform.getCategoryId() != null) {
            Category category = categoryService.findById(tierListform.getCategoryId());
            tierList.setCategory(category);
        }

        TierList savedTierList = tierListDatasourcePort.save(tierList);

        List<Column> columns = tierListform.getColumns().stream()
                .map(form -> {
                    Column column = new Column();
                    column.setName(form.getName());
                    column.setPosition(form.getPosition());
                    return column;
                })
                .collect(Collectors.toCollection(ArrayList::new));
        tierList.setColumns(columns);

        List<Logo> logos = logoService.getOrCreateAll(tierListform.getLogos());
        tierList.setLogos(logos);

        return tierListDatasourcePort.save(savedTierList);
    }

    public List<TierList> findAll() {
        return tierListDatasourcePort.findAll();
    }

    public TierList findById(Long id) {
        return tierListDatasourcePort.findById(id).orElse(null);
    }

    public TierList findByCreatorId(Long creatorId) {
        return tierListDatasourcePort.findByCreatorId(creatorId).orElse(null);
    }

    public List<TierList> findByCategoryId(Long categoryId) {
        return tierListDatasourcePort.findByCategoryId(categoryId);
    }

    public TierList update(Long id, TierListForm tierListForm) {
        Optional<TierList> optionalTierList = tierListDatasourcePort.findById(id);
        if (optionalTierList.isEmpty()) {
            throw new IllegalArgumentException("Tier List not found with id: " + id);
        }
        TierList tierList = optionalTierList.get();
        tierList.setName(tierListForm.getName());

        List<Column> updatedColumns = columnService.updateAll(tierListForm.getColumns(), tierList);
        tierList.setColumns(updatedColumns);

        List<Logo> updatedLogos = logoService.refreshAll(tierListForm.getLogos());
        tierList.setLogos(updatedLogos);

        return tierListDatasourcePort.save(tierList);
    }

    public void delete(Long id) {
        tierListDatasourcePort.deleteById(id);
    }
}
