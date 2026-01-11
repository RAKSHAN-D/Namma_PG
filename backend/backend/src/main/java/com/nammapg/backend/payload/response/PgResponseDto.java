package com.nammapg.backend.payload.response;

public class PgResponseDto {
    private Long id;
    private String name;
    private String area;
    private String city;
    private String gender;
    private boolean active;
    private int totalRooms;
    private String ownerName;
    private String ownerEmail;

    public PgResponseDto() {
    }

    public PgResponseDto(Long id, String name, String area, String city, String gender, boolean active, int totalRooms,
            String ownerName, String ownerEmail) {
        this.id = id;
        this.name = name;
        this.area = area;
        this.city = city;
        this.gender = gender;
        this.active = active;
        this.totalRooms = totalRooms;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
}
