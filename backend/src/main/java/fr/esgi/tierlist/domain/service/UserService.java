package fr.esgi.tierlist.domain.service;

import fr.esgi.tierlist.domain.model.User;
import fr.esgi.tierlist.application.form.UserForm;
import fr.esgi.tierlist.domain.port.UserDatasourcePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserDatasourcePort userDatasourcePort;

    public List<User> findAll() {
        return userDatasourcePort.findAll();
    }

    public User findById(Long id) {
        return userDatasourcePort.findById(id).orElse(null);
    }

    public User findByUsername(String username) {
        return userDatasourcePort.findByUsername(username).orElse(null);
    }

    public User update(Long id, UserForm userForm) {
        Optional<User> optionalUser = userDatasourcePort.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(userForm.getUsername());
            user.setEmail(userForm.getEmail());
            return userDatasourcePort.save(user);
        }
        return null;
    }

    public void delete(Long id) {
        userDatasourcePort.deleteById(id);
    }
}
