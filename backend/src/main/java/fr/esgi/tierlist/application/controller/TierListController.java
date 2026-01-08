package fr.esgi.tierlist.application.controller;

import fr.esgi.tierlist.domain.model.TierList;
import fr.esgi.tierlist.application.dto.TierListDto;
import fr.esgi.tierlist.application.form.TierListForm;
import fr.esgi.tierlist.domain.service.TierListService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tier-lists")
public class TierListController {

    private final TierListService tierListService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new Tier List")
    public TierListDto create(@RequestBody TierListForm tierListForm) {
        TierList tierList = tierListService.create(tierListForm);
        return TierListDto.transfer(tierList);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find Tier List by ID")
    public TierListDto findById(@PathVariable Long id) {
        TierList tierList = tierListService.findById(id);
        return TierListDto.transfer(tierList);
    }

    @GetMapping("/creator/{creatorId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find Tier List by user ID")
    public TierListDto findByCreatorId(@PathVariable Long creatorId) {
        TierList tierList = tierListService.findByCreatorId(creatorId);
        return TierListDto.transfer(tierList);
    }

    @GetMapping("/category/{categoryId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find Tier List by category ID")
    public List<TierListDto> findByCategoryId(@PathVariable Long categoryId) {
        List<TierList> tierLists = tierListService.findByCategoryId(categoryId);
        return tierLists.stream().map(TierListDto::transfer).toList();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update Tier List by ID")
    public TierListDto update(@PathVariable Long id, @RequestBody TierListForm tierListForm) {
        TierList tierList = tierListService.update(id, tierListForm);
        return TierListDto.transfer(tierList);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Tier List by ID")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        tierListService.delete(id);
    }

}
