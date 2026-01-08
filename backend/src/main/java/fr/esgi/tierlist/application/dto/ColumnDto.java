package fr.esgi.tierlist.application.dto;

import fr.esgi.tierlist.domain.model.Column;

import java.time.LocalDateTime;

public record ColumnDto(Long id, String name, int position,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static ColumnDto transfer(Column column) {
        return new ColumnDto(
                column.getId(),
                column.getName(),
                column.getPosition(),
                column.getCreatedAt(),
                column.getUpdatedAt()
        );
    }
}
