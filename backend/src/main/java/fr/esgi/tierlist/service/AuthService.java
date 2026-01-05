package fr.esgi.tierlist.service;

import fr.esgi.tierlist.form.UserForm;

public interface AuthService {
    String authenticate(String username, String password);
    String register(UserForm userForm);
}
