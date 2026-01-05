package fr.esgi.tierlist.service.impl;

import fr.esgi.tierlist.business.TierList;
import fr.esgi.tierlist.business.User;
import fr.esgi.tierlist.dto.TierListDto;
import fr.esgi.tierlist.dto.UserDto;
import fr.esgi.tierlist.form.TierListForm;
import fr.esgi.tierlist.form.UserForm;
import fr.esgi.tierlist.repository.TierListRepository;
import fr.esgi.tierlist.repository.UserRepository;
import fr.esgi.tierlist.service.TierListService;
import fr.esgi.tierlist.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    @Override
    public User update(Long id, UserForm userForm) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(userForm.getUsername());
            user.setEmail(userForm.getEmail());
            return userRepository.save(user);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
