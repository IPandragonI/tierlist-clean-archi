package fr.esgi.tierlist.application.dto;

import fr.esgi.tierlist.domain.model.TierList;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link TierList}
 */
public record TierListDto(Long id, String name, UserDto creator, List<ColumnDto> columns, List<LogoDto> logo, CategoryDto category,
                          LocalDateTime createdAt, LocalDateTime updatedAt) implements Serializable {

    public static TierListDto transfer(TierList tierList) {
        List<ColumnDto> columnDtos = tierList.getColumns().stream()
                .map(ColumnDto::transfer)
                .toList();

        List<LogoDto> logoDtos = tierList.getLogos().stream()
                .map(LogoDto::transfer)
                .toList();

        return new TierListDto(
                tierList.getId(),
                tierList.getName(),
                UserDto.transfer(tierList.getCreator()),
                columnDtos,
                logoDtos,
                CategoryDto.transfer(tierList.getCategory()),
                tierList.getCreatedAt(),
                tierList.getUpdatedAt()
        );
    }
}