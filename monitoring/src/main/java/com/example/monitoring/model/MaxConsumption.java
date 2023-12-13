package com.example.monitoring.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
public class MaxConsumption {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name="id", columnDefinition = "BINARY(16)")
    private UUID id;
    @Column(name="device_id", columnDefinition = "BINARY(16)")
    private UUID deviceID;
    @Column(name="energy", nullable = false)
    private int energy;

    @Column(name="user_id", columnDefinition = "BINARY(16)")
    private UUID userID;

    public MaxConsumption() {

    }
    public MaxConsumption(UUID id, UUID deviceID, int energy, UUID userID) {
        this.id = id;
        this.deviceID = deviceID;
        this.energy = energy;
        this.userID = userID;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDeviceID() {
        return deviceID;
    }

    public void setDeviceID(UUID deviceID) {
        this.deviceID = deviceID;
    }

    public int getEnergy() {
        return energy;
    }

    public void setEnergy(int energy) {
        this.energy = energy;
    }

    public UUID getUserID() {
        return userID;
    }

    public void setUserID(UUID userID) {
        this.userID = userID;
    }
}
