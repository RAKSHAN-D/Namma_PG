package com.nammapg.backend.payload.response;

import java.time.LocalDateTime;
import java.util.List;

public class PgDetailDto extends PgResponseDto {
    private String description;
    private int totalFloors;
    private double rating;
    private List<FacilityDto> facilities;
    private FoodDto food;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ownerUsername;
    private LocalDateTime ownerJoinedAt;

    public PgDetailDto() {
        super();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(int totalFloors) {
        this.totalFloors = totalFloors;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public List<FacilityDto> getFacilities() {
        return facilities;
    }

    public void setFacilities(List<FacilityDto> facilities) {
        this.facilities = facilities;
    }

    public FoodDto getFood() {
        return food;
    }

    public void setFood(FoodDto food) {
        this.food = food;
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

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public LocalDateTime getOwnerJoinedAt() {
        return ownerJoinedAt;
    }

    public void setOwnerJoinedAt(LocalDateTime ownerJoinedAt) {
        this.ownerJoinedAt = ownerJoinedAt;
    }
}
