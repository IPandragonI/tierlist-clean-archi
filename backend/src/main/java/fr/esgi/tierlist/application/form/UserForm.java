package fr.esgi.tierlist.application.form;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserForm {
    private String lastname;
    private String firstname;

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
