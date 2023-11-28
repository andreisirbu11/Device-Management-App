package org.example;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.json.simple.JSONObject;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.concurrent.TimeoutException;

public class CSVReader {
    private final static String QUEUE_NAME = "measurements";

    public static void main(String[] args) {
        String csvFile = "./sensor.csv";
        System.out.println(args[0]);

        Connection connection = null;
        Channel channel = null;

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            String line;
            LocalDate today = LocalDate.now();

            // Set the time to midnight (00:00)
            LocalTime midnight = LocalTime.MIDNIGHT;

            // Combine the date and time to create a LocalDateTime
            LocalDateTime todayMidnight = LocalDateTime.of(today, midnight);

            // Convert LocalDateTime to a timestamp (in milliseconds since the epoch)
            long timestamp = todayMidnight.atZone(ZoneId.of("UTC")).toInstant().toEpochMilli();
            long timestampSeconds = timestamp / 1000;
            Date date = new Date(timestampSeconds * 1000);

            // Format the Date object as 'yyyy-MM-dd'T'HH:mm:ss'
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            String formattedDate = dateFormat.format(date);

            System.out.println(formattedDate);

            while ((line = br.readLine()) != null) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("timestamp", timestamp);
                jsonObject.put("device_id", args[0]);
                jsonObject.put("measurement_value", Float.parseFloat(line));
                String jsonString = jsonObject.toJSONString();

                // RabbitMQ connection and channel setup
                try {
                    ConnectionFactory factory = new ConnectionFactory();
                    factory.setUri("amqp://cstonxxq:Q-36phCK2ua_lFlnQqu2J5TlCpcZvowm@hawk-01.rmq.cloudamqp.com/cstonxxq");

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

                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                timestamp = timestamp + + (10 * 60 * 1000);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
