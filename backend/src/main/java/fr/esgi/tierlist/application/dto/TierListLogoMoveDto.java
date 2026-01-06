package fr.esgi.tierlist.application.dto;

import fr.esgi.tierlist.domain.model.TierListLogoMove;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link TierListLogoMove}
 */
public record TierListLogoMoveDto(Long id, TierListDto tierList, LogoDto logo, UserDto user, ColumnDto column,
                                  LocalDateTime createdAt) implements Serializable {

    public static TierListLogoMoveDto transfer(TierListLogoMove tierList) {
        return new TierListLogoMoveDto(
                tierList.getId(),
                TierListDto.transfer(tierList.getTierList()),
                LogoDto.transfer(tierList.getLogo()),
                UserDto.transfer(tierList.getUser()),
                ColumnDto.transfer(tierList.getColumn()),
                tierList.getCreatedAt()
        );
    }
}