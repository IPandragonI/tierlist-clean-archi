package fr.esgi.tierlist.domain.service;

import fr.esgi.tierlist.application.form.TierListLogoMoveForm;
import fr.esgi.tierlist.domain.model.*;
import fr.esgi.tierlist.domain.port.TierListLogoMoveDatasourcePort;
import fr.esgi.tierlist.infrastructure.security.IAuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TierListLogoMoveService {
    private final TierListLogoMoveDatasourcePort tierListLogoMoveDatasourcePort;
    private final TierListService tierListService;
    private final ColumnService columnService;
    private final LogoService logoService;
    private final IAuthenticationFacade authenticationFacade;
    
    public TierListLogoMove create(TierListLogoMoveForm tierListLogoForm) {
        User user = authenticationFacade.getCurrentUser();
        TierList tierList = tierListService.findById(tierListLogoForm.getTierListId());
        Column column = columnService.findById(tierListLogoForm.getColumnId());
        Logo logo = logoService.findById(tierListLogoForm.getLogoId());
        
        StringBuilder missing = new StringBuilder();
        if (user == null) missing.append("user, ");
        if (tierList == null) missing.append("tierList, ");
        if (column == null) missing.append("column, ");
        if (logo == null) missing.append("logo, ");

        if (!missing.isEmpty()) {
            String missingFields = missing.substring(0, missing.length() - 2);
            throw new IllegalArgumentException("Invalid data provided: missing " + missingFields);
        }

        TierListLogoMove tierListLogoMove = new TierListLogoMove();
        tierListLogoMove.setTierList(tierList);
        tierListLogoMove.setColumn(column);
        tierListLogoMove.setLogo(logo);
        tierListLogoMove.setCreatedAt(LocalDateTime.now());
        return tierListLogoMoveDatasourcePort.save(tierListLogoMove);
    }
}
