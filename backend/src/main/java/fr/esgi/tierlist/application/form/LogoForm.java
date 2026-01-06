package fr.esgi.tierlist.application.form;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LogoForm {
    @NotBlank(message = "Domain is required")
    private String domain;
}
