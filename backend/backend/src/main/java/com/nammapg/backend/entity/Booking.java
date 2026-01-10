package com.nammapg.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =====================
       RELATIONSHIPS
       ===================== */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pg_id", nullable = false)
    private Pg pg;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Rooms room;

    /* =====================
       STAY DETAILS
       ===================== */

    @Column(nullable = false)
    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Integer stayDurationMonths;

    /* =====================
       ROOM / BED SNAPSHOT
       ===================== */

    private Integer bedCountBooked;

    private String roomSharingType;

    /* =====================
       FINANCIAL DETAILS
       ===================== */

    private Double monthlyRentAtBooking;

    private Double securityDeposit;

    private Double maintenanceCharge;

    private Double totalAmount;

    private String paymentStatus; // PENDING, PAID, PARTIAL

    private String paymentMode; // UPI, CASH, CARD, BANK

    /* =====================
       BOOKING STATUS
       ===================== */

    @Column(nullable = false)
    private String bookingStatus;
    // REQUESTED, CONFIRMED, CHECKED_IN, CANCELLED, COMPLETED

    /* =====================
       LIFECYCLE TIMESTAMPS
       ===================== */

    private LocalDateTime bookingDate;

    private LocalDateTime checkInActualDate;

    private LocalDateTime checkOutActualDate;

    private LocalDateTime cancelledAt;

    /* =====================
       NOTES
       ===================== */

    private String remarks;

    private String cancelReason;

    /* =====================
       AUDIT
       ===================== */

    private boolean active = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Booking() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pg getPg() {
        return pg;
    }

    public void setPg(Pg pg) {
        this.pg = pg;
    }

    public Rooms getRoom() {
        return room;
    }

    public void setRoom(Rooms room) {
        this.room = room;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Integer getStayDurationMonths() {
        return stayDurationMonths;
    }

    public void setStayDurationMonths(Integer stayDurationMonths) {
        this.stayDurationMonths = stayDurationMonths;
    }

    public Integer getBedCountBooked() {
        return bedCountBooked;
    }

    public void setBedCountBooked(Integer bedCountBooked) {
        this.bedCountBooked = bedCountBooked;
    }

    public String getRoomSharingType() {
        return roomSharingType;
    }

    public void setRoomSharingType(String roomSharingType) {
        this.roomSharingType = roomSharingType;
    }

    public Double getMonthlyRentAtBooking() {
        return monthlyRentAtBooking;
    }

    public void setMonthlyRentAtBooking(Double monthlyRentAtBooking) {
        this.monthlyRentAtBooking = monthlyRentAtBooking;
    }

    public Double getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(Double securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public Double getMaintenanceCharge() {
        return maintenanceCharge;
    }

    public void setMaintenanceCharge(Double maintenanceCharge) {
        this.maintenanceCharge = maintenanceCharge;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalDateTime getCheckInActualDate() {
        return checkInActualDate;
    }

    public void setCheckInActualDate(LocalDateTime checkInActualDate) {
        this.checkInActualDate = checkInActualDate;
    }

    public LocalDateTime getCheckOutActualDate() {
        return checkOutActualDate;
    }

    public void setCheckOutActualDate(LocalDateTime checkOutActualDate) {
        this.checkOutActualDate = checkOutActualDate;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
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
