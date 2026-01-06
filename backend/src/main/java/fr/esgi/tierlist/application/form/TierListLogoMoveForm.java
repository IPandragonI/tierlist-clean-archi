package fr.esgi.tierlist.application.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TierListLogoMoveForm {

    @NotBlank(message = "Tier List ID is required")
    private Long tierListId;

    @NotBlank(message = "Logo ID is required")
    private Long logoId;

    @NotEmpty(message = "Column ID is required")
    private Long columnId;
}