package fr.esgi.tierlist.application.dto;

import fr.esgi.tierlist.domain.model.Column;

public record ColumnDto(Long id, String name, TierListDto tierList, int position,
                        java.time.LocalDateTime createdAt, java.time.LocalDateTime updatedAt) {
    public static ColumnDto transfer(Column column) {
        return new ColumnDto(
                column.getId(),
                column.getName(),
                TierListDto.transfer(column.getTierList()),
                column.getPosition(),
                column.getCreatedAt(),
                column.getUpdatedAt()
        );
    }
}
