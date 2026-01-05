package fr.esgi.tierlist.service.impl;

import fr.esgi.tierlist.business.User;
import fr.esgi.tierlist.form.UserForm;
import fr.esgi.tierlist.repository.UserRepository;
import fr.esgi.tierlist.security.JwtUtil;
import fr.esgi.tierlist.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final PasswordEncoder encoder;

    private final JwtUtil jwtUtils;

    @Override
    public String authenticate(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtUtils.generateToken(userDetails.getUsername());
    }

    @Override
    public String register(UserForm userForm) {
        if (userRepository.existsByUsername(userForm.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(userForm.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setFirstname(userForm.getFirstname());
        user.setLastname(userForm.getLastname());
        user.setUsername(userForm.getUsername());
        user.setEmail(userForm.getEmail());
        user.setPassword(encoder.encode(userForm.getPassword()));

        userRepository.save(user);

        return "User registered successfully!";
    }
}
