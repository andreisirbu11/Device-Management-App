package com.example.demo.controller;

import com.example.demo.model.Device;
import com.example.demo.model.User;
import com.example.demo.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping(value = "/device")
public class DeviceController {
    private DeviceService deviceService;
    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.findAll();
    }
    @GetMapping("/user/{id}")
    public List<Device> getDevicesByUserId(@PathVariable UUID id) {
        return deviceService.findByUserId(id);
    }
    @PostMapping("/user/{user_id}")
    public Device insertDevice(@Valid @RequestBody Device deviceBody, @PathVariable("user_id") UUID userID) {
        User user = new User(userID);
        Device newDevice = new Device();
        newDevice.setUser(user);
        newDevice.setDescription(deviceBody.getDescription());
        newDevice.setAddress(deviceBody.getAddress());
        newDevice.setEnergy(deviceBody.getEnergy());
        return deviceService.insert(newDevice);
    }
    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable("id") UUID id) {
        deviceService.deleteById(id);
    }
    @PutMapping("/{id}")
    public Device updateDevice(@PathVariable("id") UUID id, @RequestBody Device deviceBody) {
        return deviceService.update(id, deviceBody);
    }
}
