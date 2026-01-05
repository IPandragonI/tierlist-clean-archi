package fr.esgi.tierlist.controller;

import fr.esgi.tierlist.business.User;
import fr.esgi.tierlist.form.LoginForm;
import fr.esgi.tierlist.form.UserForm;
import fr.esgi.tierlist.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signing")
    @ResponseStatus(HttpStatus.OK)
    public String authenticateUser(@RequestBody LoginForm user) {
        return authService.authenticate(user.getUsername(), user.getPassword());
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public String registerUser(@RequestBody UserForm userForm) {
        return authService.register(userForm);
    }
}
