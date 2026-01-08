package fr.esgi.tierlist.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "columns")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class ColumnEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    //TODO Il y a une stackoverflow à cause d'une reference circulaire entre les colonnes et les tierlists
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tier_list_id", nullable = false)
    @ToString.Exclude
    private TierListEntity tierList;

    @Column
    private int position;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
