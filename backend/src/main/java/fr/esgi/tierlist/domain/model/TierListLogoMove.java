package fr.esgi.tierlist.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class TierListLogoMove {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private TierList tierList;

    private Logo logo;

    private User user;

    private Column column;

    private LocalDateTime createdAt;
}
