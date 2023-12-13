package com.example.demo.model;

import java.util.UUID;

public class AuthenticationResponse {
    private String token;
    private UUID id;
    private String role;

    public AuthenticationResponse() {

    }

    public AuthenticationResponse(String token, UUID id, String role) {
        this.token = token;
        this.id = id;
        this.role = role;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
