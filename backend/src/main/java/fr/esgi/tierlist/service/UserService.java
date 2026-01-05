package fr.esgi.tierlist.service;

import fr.esgi.tierlist.business.User;
import fr.esgi.tierlist.form.UserForm;

public interface UserService {
    User findById(Long id);
    User update(Long id, UserForm userForm);
    void delete(Long id);
}
