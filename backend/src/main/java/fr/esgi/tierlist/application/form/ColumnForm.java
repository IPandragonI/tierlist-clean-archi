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
public class ColumnForm {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Position is required")
    private int position;
}
