package fr.esgi.tierlist.dto;

import fr.esgi.tierlist.business.User;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link fr.esgi.tierlist.business.User}
 */
public record UserDto(Long id, String lastname, String firstname, String username, String email,
                      LocalDateTime createdAt, LocalDateTime updatedAt) implements Serializable {

    public static UserDto transfer(User user) {
        return new UserDto(
                user.getId(),
                user.getLastname(),
                user.getFirstname(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}