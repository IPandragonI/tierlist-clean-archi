package fr.esgi.tierlist.application.form;

import lombok.*;
import jakarta.validation.constraints.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TierListForm {

    @NotBlank(message = "Name is required")
    private String name;
    private List<LogoForm> logos;

    @NotEmpty(message = "At least one column is required")
    private List<ColumnForm> columns;
}