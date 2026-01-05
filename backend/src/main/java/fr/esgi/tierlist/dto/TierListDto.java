package fr.esgi.tierlist.dto;

import fr.esgi.tierlist.business.TierList;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO for {@link fr.esgi.tierlist.business.TierList}
 */
public record TierListDto(Long id, String name, Map<String, Object> configuration, UserDto creator,
                          LocalDateTime createdAt, LocalDateTime updatedAt) implements Serializable {

    public static TierListDto transfer(TierList tierList) {
        return new TierListDto(
                tierList.getId(),
                tierList.getName(),
                tierList.getConfiguration(),
                UserDto.transfer(tierList.getCreator()),
                tierList.getCreatedAt(),
                tierList.getUpdatedAt()
        );
    }
}