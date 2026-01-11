package com.nammapg.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pgs")
public class Pg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * =========================
     * BASIC PG DETAILS
     * =========================
     */

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    // BOYS / GIRLS / COLIVING
    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private String city;

    /*
     * =========================
     * BUILDING DETAILS
     * =========================
     */

    private int totalFloors;

    private int totalRooms;

    /*
     * =========================
     * STATUS & RATING
     * =========================
     */

    // Average rating (derived later from reviews)
    private double rating = 0.0;

    // Soft delete / enable-disable
    @Column(nullable = false)
    private boolean active = true;

    /*
     * =========================
     * OWNER MAPPING
     * =========================
     */

    // One PG → One Owner
    // One Owner → Many PGs
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    /*
     * =========================
     * FACILITIES
     * =========================
     */

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "pg_facilities", joinColumns = @JoinColumn(name = "pg_id"), inverseJoinColumns = @JoinColumn(name = "facility_id"))
    private Set<Facility> facilities = new HashSet<>();

    /*
     * =========================
     * FOOD (ONE-TO-ONE)
     * =========================
     */

    @OneToOne(mappedBy = "pg", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Prevent infinite recursion
    private Food food;

    /*
     * =========================
     * AUDIT FIELDS
     * =========================
     */

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    /*
     * =========================
     * LIFECYCLE CALLBACKS
     * =========================
     */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /*
     * =========================
     * CONSTRUCTORS
     * =========================
     */

    public Pg() {
    }

    /*
     * =========================
     * GETTERS & SETTERS
     * =========================
     */

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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(int totalFloors) {
        this.totalFloors = totalFloors;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Set<Facility> getFacilities() {
        return facilities;
    }

    public void setFacilities(Set<Facility> facilities) {
        this.facilities = facilities;
    }

    public Food getFood() {
        return food;
    }

    public void setFood(Food food) {
        this.food = food;
        if (food != null) {
            food.setPg(this);
        }
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
