package com.example.monitoring.service;

import com.example.monitoring.model.MaxConsumption;
import com.example.monitoring.model.Monitoring;
import com.example.monitoring.repo.MaxConsumptionRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MaxConsumptionService {
    private MaxConsumptionRepo maxConsumptionRepo;
    @Autowired
    public MaxConsumptionService(MaxConsumptionRepo maxConsumptionRepo) {
        this.maxConsumptionRepo = maxConsumptionRepo;
    }
    @Transactional
    @RabbitListener(queues = "consumption")
    public void receiveMessage(String message) throws JsonProcessingException {
        System.out.println(message);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);
        String operation = jsonNode.get("operation").asText();

        switch (operation) {
            case "DELETE":
                UUID id = UUID.fromString(jsonNode.get("device_id").asText());
                maxConsumptionRepo.deleteByDeviceId(id);
                break;
            case "INSERT":
                int energy = jsonNode.get("energy").asInt();
                UUID deviceID = UUID.fromString(jsonNode.get("device_id").asText());
                UUID userID = UUID.fromString(jsonNode.get("user_id").asText());

                MaxConsumption newDevice = new MaxConsumption();
                newDevice.setDeviceID(deviceID);
                newDevice.setEnergy(energy);
                newDevice.setUserID(userID);
                maxConsumptionRepo.save(newDevice);
                break;
            default:
                System.out.println("Operation can't be executed!");
                break;
        }
    }
}
