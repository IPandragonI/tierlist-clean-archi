package fr.esgi.tierlist.form;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class UserForm {
    private String lastname;
    private String firstname;
    private String username;
    private String email;
    private String password;
}
