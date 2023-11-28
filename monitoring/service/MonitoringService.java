package com.example.monitoring.service;

import com.example.monitoring.model.MaxConsumption;
import com.example.monitoring.model.Monitoring;
import com.example.monitoring.repo.MonitoringRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONObject;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.net.InetSocketAddress;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class MonitoringService {
    private Map<UUID, List<Double>> measurementsMap = new HashMap<>();
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private MonitoringRepo monitoringRepo;
    @Autowired
    public MonitoringService(MonitoringRepo monitoringRepo) {
        this.monitoringRepo = monitoringRepo;
    }
    @RabbitListener(queues = "measurements")
    public void receiveMessage(String message) throws JsonProcessingException {
        System.out.println(message);

        //deserializare
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);
        double measurementValue = jsonNode.get("measurement_value").asDouble();
        long timestamp = jsonNode.get("timestamp").asLong();
        String deviceIDText = jsonNode.get("device_id").asText();
        UUID deviceID = UUID.fromString(deviceIDText);

        if (!measurementsMap.containsKey(deviceID)) {
            measurementsMap.put(deviceID, new ArrayList<>());
        }

        // Add the measurement value to the list for the specific device
        measurementsMap.get(deviceID).add(measurementValue);

        //salvez valoarea citita
        Monitoring newValue = new Monitoring();
        newValue.setMeasurementValue((float)measurementValue);
        newValue.setDeviceID(deviceID);
        newValue.setTimestamp(timestamp);
        monitoringRepo.save(newValue);

        MaxConsumption maxConsumption = monitoringRepo.getMaxEnergyConsumption(deviceID);

        String notification = "";
        if(measurementValue > (float)maxConsumption.getEnergy()) {
            notification = maxConsumption.getDeviceID() + " exceeded limit!\n"
                    + "Measurement value: " + measurementValue;
        }
        else {
            notification = maxConsumption.getDeviceID() + " is within range!\n"
                    + "Measurement value: " + measurementValue;
        }

        notifyUI("/topic/", maxConsumption.getUserID(), notification);

        if(measurementsMap.get(deviceID).size() % 6 == 0) {

            double medianValue = calculateMedian(measurementsMap.get(deviceID), deviceID);
            timestamp = timestamp / 1000;
            Date date = new Date(timestamp * 1000);

            // Format the Date object as 'yyyy-MM-dd'T'HH:mm:ss'
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            String formattedDate = dateFormat.format(date);

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("timestamp", formattedDate);
            jsonObject.put("value", (int)medianValue);
            String jsonString = jsonObject.toJSONString();

            notifyUI("/topic/monitoring/", deviceID, jsonString);

        }
    }

    private double calculateMedian(List<Double> values, UUID deviceID) {
        // Check if there are at least six values
        if (values.size() < 6) {
            // Handle the case where there are fewer than six values (return a default value or throw an exception)
            return 0.0; // Replace with your appropriate handling
        }

        // Extract the first six values
        List<Double> firstSixValues = values.subList(0, 6);

        // Calculate the median of the first six values
        double calculatedMedianValue;

        if (firstSixValues.size() % 2 == 0) {
            // If the number of values is even, calculate the average of the middle two values
            int middleIndex1 = firstSixValues.size() / 2 - 1;
            int middleIndex2 = firstSixValues.size() / 2;
            calculatedMedianValue = (firstSixValues.get(middleIndex1) + firstSixValues.get(middleIndex2)) / 2.0;
        } else {
            // If the number of values is odd, pick the middle value
            int middleIndex = firstSixValues.size() / 2;
            calculatedMedianValue = firstSixValues.get(middleIndex);
        }

        // Remove the first six values from the original list
        values.subList(0, 6).clear();
        measurementsMap.put(deviceID, values);

        return calculatedMedianValue;
    }
    private void notifyUI(String topic, UUID userID, String message) {
        // Send a message to the specified WebSocket destination
        messagingTemplate.convertAndSend(topic + userID , message);
    }
}
