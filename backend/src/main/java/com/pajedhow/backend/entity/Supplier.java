package com.pajedhow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;
    private String country;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;

    private String responseTime;

    @Column(nullable = false)
    @Builder.Default
    private boolean verified = false;
}
