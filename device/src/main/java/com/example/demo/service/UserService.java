package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private UserRepo userRepo;
    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    public List<User> selectAll() {
        return userRepo.findAll();
    }
    public User insert(UUID id) {
        User newUser = new User(id);
        return userRepo.save(newUser);
    }
    public void delete(UUID id) {
        userRepo.deleteById(id);
    }
}
