package com.example.monitoring.repo;

import com.example.monitoring.model.MaxConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface MaxConsumptionRepo extends JpaRepository<MaxConsumption, UUID> {
    @Modifying
    @Query("DELETE FROM MaxConsumption mc WHERE mc.deviceID = :deviceID")
    void deleteByDeviceId(@Param("deviceID") UUID deviceID);
}
