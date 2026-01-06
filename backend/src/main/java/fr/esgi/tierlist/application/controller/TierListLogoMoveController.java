package fr.esgi.tierlist.application.controller;

import fr.esgi.tierlist.application.dto.TierListLogoMoveDto;
import fr.esgi.tierlist.application.form.TierListLogoMoveForm;
import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.domain.model.TierListLogoMove;
import fr.esgi.tierlist.domain.service.TierListLogoMoveService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

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

    @PostMapping("/export/{tierlistId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Export Tier List by ID")
    public ModelAndView export(@PathVariable Long tierlistId) {
        List<TierListLogoMove> tierListLogoMoves = tierListLogoMoveService.findAllByTierListId(tierlistId);
        if (tierListLogoMoves == null) {
            throw new IllegalArgumentException("No logo moves found for Tier List with id: " + tierlistId);
        }

        ModelAndView mav = new ModelAndView("exportSyntheseTierListsPdfView");
        mav.addObject("tierListLogoMoves", tierListLogoMoves);
        return mav;
    }
}
