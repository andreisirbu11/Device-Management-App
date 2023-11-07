package com.example.demo.repo;

import com.example.demo.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface DeviceRepo extends JpaRepository<Device, UUID> {
    @Query("SELECT d FROM Device d WHERE d.user.id = :user_id")
    List<Device> findByUserId(@Param("user_id") UUID id);
}

