package fr.esgi.tierlist.infrastructure.security;

import fr.esgi.tierlist.domain.model.User;
import fr.esgi.tierlist.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticationFacade implements IAuthenticationFacade {

    private final UserService userService;

    @Override
    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        } else if (principal instanceof UserDetails userDetails) {
            return userService.findByUsername(userDetails.getUsername());
        } else if (principal != null) {
            return userService.findByUsername(principal.toString());
        }

        return null;
    }
}
