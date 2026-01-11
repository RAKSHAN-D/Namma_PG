package com.nammapg.backend.payload.response;

import java.time.LocalTime;

public class FoodDto {
    private Long id;
    //private String foodType;
    private boolean eggsProvided;
    private boolean breakfast;
    private LocalTime breakfastStartTime;
    private LocalTime breakfastEndTime;
    private boolean lunch;
    private LocalTime lunchStartTime;
    private LocalTime lunchEndTime;
    private boolean dinner;
    private LocalTime dinnerStartTime;
    private LocalTime dinnerEndTime;
    private boolean sundaySpecial;
    private String sundaySpecialItem;
    private boolean weeklySweetProvided;
    private String weeklySweetDay;
    private String weeklySweetItem;
    private boolean weeklyKitchenClosed;
    private String kitchenClosedDay;
    private boolean includedInRent;
    private String remarks;

    public FoodDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

   public String getFoodType() {
        // MVP rule: all PGs support both
        return "Veg & Non-Veg";
    }


   

    public boolean isEggsProvided() {
        return eggsProvided;
    }

    public void setEggsProvided(boolean eggsProvided) {
        this.eggsProvided = eggsProvided;
    }

    public boolean isBreakfast() {
        return breakfast;
    }

    public void setBreakfast(boolean breakfast) {
        this.breakfast = breakfast;
    }

    public LocalTime getBreakfastStartTime() {
        return breakfastStartTime;
    }

    public void setBreakfastStartTime(LocalTime breakfastStartTime) {
        this.breakfastStartTime = breakfastStartTime;
    }

    public LocalTime getBreakfastEndTime() {
        return breakfastEndTime;
    }

    public void setBreakfastEndTime(LocalTime breakfastEndTime) {
        this.breakfastEndTime = breakfastEndTime;
    }

    public boolean isLunch() {
        return lunch;
    }

    public void setLunch(boolean lunch) {
        this.lunch = lunch;
    }

    public LocalTime getLunchStartTime() {
        return lunchStartTime;
    }

    public void setLunchStartTime(LocalTime lunchStartTime) {
        this.lunchStartTime = lunchStartTime;
    }

    public LocalTime getLunchEndTime() {
        return lunchEndTime;
    }

    public void setLunchEndTime(LocalTime lunchEndTime) {
        this.lunchEndTime = lunchEndTime;
    }

    public boolean isDinner() {
        return dinner;
    }

    public void setDinner(boolean dinner) {
        this.dinner = dinner;
    }

    public LocalTime getDinnerStartTime() {
        return dinnerStartTime;
    }

    public void setDinnerStartTime(LocalTime dinnerStartTime) {
        this.dinnerStartTime = dinnerStartTime;
    }

    public LocalTime getDinnerEndTime() {
        return dinnerEndTime;
    }

    public void setDinnerEndTime(LocalTime dinnerEndTime) {
        this.dinnerEndTime = dinnerEndTime;
    }

    public boolean isSundaySpecial() {
        return sundaySpecial;
    }

    public void setSundaySpecial(boolean sundaySpecial) {
        this.sundaySpecial = sundaySpecial;
    }

    public String getSundaySpecialItem() {
        return sundaySpecialItem;
    }

    public void setSundaySpecialItem(String sundaySpecialItem) {
        this.sundaySpecialItem = sundaySpecialItem;
    }

    public boolean isWeeklySweetProvided() {
        return weeklySweetProvided;
    }

    public void setWeeklySweetProvided(boolean weeklySweetProvided) {
        this.weeklySweetProvided = weeklySweetProvided;
    }

    public String getWeeklySweetDay() {
        return weeklySweetDay;
    }

    public void setWeeklySweetDay(String weeklySweetDay) {
        this.weeklySweetDay = weeklySweetDay;
    }

    public String getWeeklySweetItem() {
        return weeklySweetItem;
    }

    public void setWeeklySweetItem(String weeklySweetItem) {
        this.weeklySweetItem = weeklySweetItem;
    }

    public boolean isWeeklyKitchenClosed() {
        return weeklyKitchenClosed;
    }

    public void setWeeklyKitchenClosed(boolean weeklyKitchenClosed) {
        this.weeklyKitchenClosed = weeklyKitchenClosed;
    }

    public String getKitchenClosedDay() {
        return kitchenClosedDay;
    }

    public void setKitchenClosedDay(String kitchenClosedDay) {
        this.kitchenClosedDay = kitchenClosedDay;
    }

    public boolean isIncludedInRent() {
        return includedInRent;
    }

    public void setIncludedInRent(boolean includedInRent) {
        this.includedInRent = includedInRent;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
