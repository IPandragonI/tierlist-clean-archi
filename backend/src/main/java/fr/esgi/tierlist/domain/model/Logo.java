package fr.esgi.tierlist.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Logo {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private String name;

    private String domain;

    private String storedUrl;

    private String originalUrl;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
