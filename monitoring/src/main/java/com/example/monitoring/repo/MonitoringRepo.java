package com.example.monitoring.repo;

import com.example.monitoring.model.MaxConsumption;
import com.example.monitoring.model.Monitoring;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface MonitoringRepo extends JpaRepository<Monitoring, UUID> {
    @Query(value = "SELECT mc " +
            "FROM MaxConsumption mc " +
            "JOIN Monitoring m ON mc.deviceID = m.deviceID " +
            "WHERE m.deviceID = :deviceID")
    MaxConsumption getMaxEnergyConsumption(@Param("deviceID") UUID deviceID);

}
