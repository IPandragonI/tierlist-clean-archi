package fr.esgi.tierlist.infrastructure.security;

import org.springframework.security.core.Authentication;
import fr.esgi.tierlist.domain.model.User;

public interface IAuthenticationFacade {
    Authentication getAuthentication();
    User getCurrentUser();
}

