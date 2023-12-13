package com.example.demo.service;

import com.example.demo.model.Device;
import com.example.demo.repo.DeviceRepo;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import jakarta.transaction.Transactional;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

@Service
public class DeviceService {
    private final static String QUEUE_NAME = "consumption";
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
        Device newDevice = deviceRepo.save(device);

        String deviceID = newDevice.getId().toString();
        String userID = newDevice.getUser().getUserID().toString();
        String energy = Float.toString((float)newDevice.getEnergy());
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("device_id", deviceID);
        jsonObject.put("energy", energy);
        jsonObject.put("user_id", userID);
        jsonObject.put("operation", "INSERT");
        String jsonString = jsonObject.toJSONString();

        Connection connection = null;
        Channel channel = null;
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setUri("amqps://cstonxxq:Q-36phCK2ua_lFlnQqu2J5TlCpcZvowm@hawk.rmq.cloudamqp.com/cstonxxq");

            connection = factory.newConnection();
            channel = connection.createChannel();

            // Declare a queue
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            // Publish the JSON string to the queue
            channel.basicPublish("", QUEUE_NAME, null, jsonString.getBytes());
            System.out.println(" [x] Sent '" + jsonString + "'");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (KeyManagementException e) {
            throw new RuntimeException(e);
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (channel != null && channel.isOpen()) {
                    channel.close();
                }
                if (connection != null && connection.isOpen()) {
                    connection.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return newDevice;
    }
    public void deleteById(UUID id) {
        deviceRepo.deleteById(id);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("device_id", id.toString());
        jsonObject.put("operation", "DELETE");
        String jsonString = jsonObject.toJSONString();

        Connection connection = null;
        Channel channel = null;
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setUri("amqps://cstonxxq:Q-36phCK2ua_lFlnQqu2J5TlCpcZvowm@hawk.rmq.cloudamqp.com/cstonxxq");

            connection = factory.newConnection();
            channel = connection.createChannel();

            // Declare a queue
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            // Publish the JSON string to the queue
            channel.basicPublish("", QUEUE_NAME, null, jsonString.getBytes());
            System.out.println(" [x] Sent '" + jsonString + "'");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (KeyManagementException e) {
            throw new RuntimeException(e);
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (channel != null && channel.isOpen()) {
                    channel.close();
                }
                if (connection != null && connection.isOpen()) {
                    connection.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
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
