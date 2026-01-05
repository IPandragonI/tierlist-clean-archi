package fr.esgi.tierlist.controller;

import fr.esgi.tierlist.dto.TierListDto;
import fr.esgi.tierlist.form.TierListForm;
import fr.esgi.tierlist.service.TierListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tier-lists")
public class TierListController {

    private final TierListService tierListService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TierListDto createTierList(@RequestBody TierListForm tierListForm) {
        return TierListDto.transfer(tierListService.create(tierListForm));
    }

    @GetMapping("/{id}")
    public TierListDto findTierListById(@PathVariable Long id) {
        return TierListDto.transfer(tierListService.findById(id));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TierListDto updateTierList(@PathVariable Long id, @RequestBody TierListForm tierListForm) {
        return TierListDto.transfer(tierListService.update(id, tierListForm));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTierList(@PathVariable Long id) {
        tierListService.delete(id);
    }

}
