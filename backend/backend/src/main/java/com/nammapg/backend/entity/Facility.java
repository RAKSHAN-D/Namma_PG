package com.nammapg.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "facilities")
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Example: WIFI, PARKING, CCTV
    @Column(nullable = false, unique = true)
    private String name;

    // Optional description
    private String description;

    // Inverse side of PG–Facility relationship
    @ManyToMany(mappedBy = "facilities")
    @JsonIgnore
    private Set<Pg> pgs;

    public Facility() {
    }

    public Facility(Long id, String name, String description, Set<Pg> pgs) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.pgs = pgs;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Pg> getPgs() {
        return pgs;
    }

    public void setPgs(Set<Pg> pgs) {
        this.pgs = pgs;
    }
}
