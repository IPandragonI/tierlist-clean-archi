package fr.esgi.tierlist.service;

import fr.esgi.tierlist.business.TierList;
import fr.esgi.tierlist.dto.TierListDto;
import fr.esgi.tierlist.form.TierListForm;

public interface TierListService {
    TierList create(TierListForm tierListForm);
    TierList findById(Long id);
    TierList update(Long id, TierListForm tierListForm);
    void delete(Long id);
}
