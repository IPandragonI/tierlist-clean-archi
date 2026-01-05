package fr.esgi.tierlist.form;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class LoginForm {
    private String username;
    private String password;
}
