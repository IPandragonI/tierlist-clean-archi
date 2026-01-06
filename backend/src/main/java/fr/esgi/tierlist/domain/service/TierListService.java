package fr.esgi.tierlist.domain.service;

import fr.esgi.tierlist.domain.model.Column;
import fr.esgi.tierlist.domain.model.Logo;
import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.application.form.TierListForm;
import fr.esgi.tierlist.domain.port.TierListDatasourcePort;
import fr.esgi.tierlist.infrastructure.security.IAuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TierListService {

    private final TierListDatasourcePort tierListDatasourcePort;
    private final ColumnService columnService;
    private final LogoService logoService;
    private final IAuthenticationFacade authenticationFacade;

    public TierList create(TierListForm tierListform) {
        TierList tierList = new TierList();
        tierList.setName(tierListform.getName());
        tierList.setCreator(authenticationFacade.getCurrentUser());

        List<Column> columns = columnService.createAll(tierListform.getColumns(), tierList);
        tierList.setColumns(columns);

        List<Logo> logos = logoService.getOrCreateAll(tierListform.getLogos());
        tierList.setLogos(logos);

        return tierListDatasourcePort.save(tierList);
    }

    public TierList findById(Long id) {
        return tierListDatasourcePort.findById(id).orElse(null);
    }

    public TierList findByCreatorId(Long creatorId) {
        return tierListDatasourcePort.findByCreatorId(creatorId).orElse(null);
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
