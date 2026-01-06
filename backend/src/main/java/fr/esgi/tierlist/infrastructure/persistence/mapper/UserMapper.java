package fr.esgi.tierlist.infrastructure.persistence.mapper;

import fr.esgi.tierlist.domain.model.User;
import fr.esgi.tierlist.infrastructure.persistence.entity.UserEntity;

public record UserMapper() {

    public static User toDomain(UserEntity e) {
        if (e == null) return null;
        User u = new User();
        u.setId(e.getId());
        u.setLastname(e.getLastname());
        u.setFirstname(e.getFirstname());
        u.setUsername(e.getUsername());
        u.setEmail(e.getEmail());
        u.setPassword(e.getPassword());
        u.setCreatedAt(e.getCreatedAt());
        u.setUpdatedAt(e.getUpdatedAt());
        return u;
    }

    public static UserEntity toEntity(User u) {
        if (u == null) return null;
        UserEntity e = new UserEntity();
        e.setId(u.getId());
        e.setLastname(u.getLastname());
        e.setFirstname(u.getFirstname());
        e.setUsername(u.getUsername());
        e.setEmail(u.getEmail());
        e.setPassword(u.getPassword());
        e.setCreatedAt(u.getCreatedAt());
        e.setUpdatedAt(u.getUpdatedAt());
        return e;
    }
}
