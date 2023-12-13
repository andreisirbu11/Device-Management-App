package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping(value = "/user")
public class UserController {
    private UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    @PostMapping()
    public User insertUser(@Valid @RequestBody User userBody) {
        return userService.insert(userBody);
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") UUID id) {
        userService.delete(id);
    }
    @PutMapping("/edit/{user_id}")
    public User updateUser(@PathVariable("user_id") UUID id, @RequestBody User userBody) {
        return userService.update(id, userBody);
    }
}
