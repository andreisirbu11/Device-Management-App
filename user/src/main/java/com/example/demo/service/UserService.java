package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    @Value("${device_backend_url}")
    private String serverUrl;
    private UserRepo userRepo;
    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    public List<User> findAll() {
        return userRepo.findAll();
    }
    public User insert(User user) {
        User newUser = userRepo.save(user);
        try {
            UUID id = newUser.getId();
            String url = serverUrl + id;
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("POST");
            int responseCode = con.getResponseCode();
            System.out.println("Response Code: " + responseCode);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return newUser;
    }
    public void delete(UUID id) {
        try {
            String url = serverUrl + id;
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("DELETE");
            int responseCode = con.getResponseCode();
            System.out.println("Response Code: " + responseCode);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        userRepo.deleteById(id);
    }
    public User update(UUID id, User userBody) {
        Optional<User> updatedUserOptional = userRepo.findById(id);
        if (updatedUserOptional.isPresent()) {
            User updatedUser = updatedUserOptional.get();
            updatedUser.setUsername(userBody.getUsername());
            updatedUser.setPassword(userBody.getPassword());
            updatedUser.setUserRole(userBody.getUserRole());
            return userRepo.save(updatedUser);
        }
        else return null;
    }
}
