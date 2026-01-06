package fr.esgi.tierlist.domain.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Column {
    private Long id;

    private String name;

    private TierList tierList;

    private int position;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
