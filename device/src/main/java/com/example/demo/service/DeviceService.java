package com.example.demo.service;

import com.example.demo.model.Device;
import com.example.demo.model.User;
import com.example.demo.repo.DeviceRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeviceService {
    private DeviceRepo deviceRepo;
    @Autowired
    public DeviceService(DeviceRepo deviceRepo) {
        this.deviceRepo = deviceRepo;
    }
    public List<Device> findAll() {
        return deviceRepo.findAll();
    }
    public List<Device> findByUserId(UUID id) { return deviceRepo.findByUserId(id); }
    @Transactional
    public Device insert(Device device) {
        return deviceRepo.save(device);
    }
    public void deleteById(UUID id) {
        deviceRepo.deleteById(id);
    }
    public Device update(UUID id, Device deviceBody) {
        Optional<Device> updatedDeviceOptional = deviceRepo.findById(id);
        if (updatedDeviceOptional.isPresent()) {
            Device updatedDevice = updatedDeviceOptional.get();
            updatedDevice.setDescription(deviceBody.getDescription());
            updatedDevice.setAddress(deviceBody.getAddress());
            updatedDevice.setEnergy(deviceBody.getEnergy());
            return deviceRepo.save(updatedDevice);
        }
        else return null;
    }
}
