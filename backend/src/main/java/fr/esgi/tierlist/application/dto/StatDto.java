package fr.esgi.tierlist.application.dto;

import fr.esgi.tierlist.domain.model.User;
import fr.esgi.tierlist.domain.model.Logo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StatDto {
    private User worstAverageRankMainUser;
    private User mostMovedLogoUser;
    private Logo mostMovedLogo;
    private Double worstAverageRankValue;
    private Logo worstAverageRankLogo;
    private Double bestAverageRankValue;
    private Logo bestAverageRankLogo;
}


