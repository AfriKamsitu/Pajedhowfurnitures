package com.pajedhow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/** Audit trail of admin actions shown on the admin activity feed. */
@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Name of the actor (admin user). */
    @Column(nullable = false)
    private String actor;

    @Column(nullable = false)
    private String action;

    private String target;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
