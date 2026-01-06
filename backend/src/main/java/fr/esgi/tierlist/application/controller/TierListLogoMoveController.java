package fr.esgi.tierlist.application.controller;

import fr.esgi.tierlist.application.dto.TierListLogoMoveDto;
import fr.esgi.tierlist.application.form.TierListLogoMoveForm;
import fr.esgi.tierlist.domain.model.TierListLogoMove;
import fr.esgi.tierlist.domain.service.TierListLogoMoveService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tier-list-logo-moves")
public class TierListLogoMoveController {
    
    private final TierListLogoMoveService tierListLogoMoveService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Move a Logo to a Tier List")
    public TierListLogoMoveDto create(TierListLogoMoveForm tierListLogoMoveForm) {
        TierListLogoMove move = tierListLogoMoveService.create(tierListLogoMoveForm);
        return TierListLogoMoveDto.transfer(move);
    }
}
