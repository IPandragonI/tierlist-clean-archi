package fr.esgi.tierlist.service.impl;

import fr.esgi.tierlist.business.TierList;
import fr.esgi.tierlist.business.User;
import fr.esgi.tierlist.form.TierListForm;
import fr.esgi.tierlist.repository.TierListRepository;
import fr.esgi.tierlist.service.TierListService;
import fr.esgi.tierlist.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TierListServiceImpl implements TierListService {

    private final UserService userService;
    private final TierListRepository tierListRepository;

    @Override
    public TierList create(TierListForm tierListform) {
        TierList tierList = new TierList();
        tierList.setName(tierListform.name());
        tierList.setConfiguration(tierListform.configuration());

        User creator = userService.findById(tierListform.creatorId());
        tierList.setCreator(creator);
        return tierListRepository.save(tierList);
    }

    @Override
    public TierList findById(Long id) {
        return tierListRepository.findById(id).orElse(null);
    }

    @Override
    public TierList update(Long id, TierListForm tierListForm) {
        Optional<TierList> optionalTierList = tierListRepository.findById(id);
        if (optionalTierList.isPresent()) {
            TierList tierList = optionalTierList.get();
            tierList.setName(tierListForm.name());
            tierList.setConfiguration(tierListForm.configuration());
            return tierListRepository.save(tierList);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        tierListRepository.deleteById(id);
    }
}
