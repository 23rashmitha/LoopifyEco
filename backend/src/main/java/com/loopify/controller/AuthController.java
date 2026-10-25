package com.loopify.controller;

import com.loopify.model.Department;
import com.loopify.model.Enums;
import com.loopify.model.User;
import com.loopify.repository.DepartmentRepository;
import com.loopify.repository.UserRepository;
import com.loopify.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository,
                          DepartmentRepository departmentRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials. Please verify your email and password."));
        }

        String deptId = user.getDepartment() != null ? user.getDepartment().getId() : "";
        String token = jwtUtils.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId(),
                user.getFullName(),
                deptId
        );

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "departmentId", deptId,
                "accountStatus", user.getAccountStatus(),
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : ""
        ));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationData) {
        String email = registrationData.get("email");
        String password = registrationData.get("password");
        String fullName = registrationData.get("fullName");
        String departmentId = registrationData.get("departmentId");
        String roleStr = registrationData.getOrDefault("role", "STUDENT_ORGANIZER");

        if (email == null || password == null || fullName == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Full name, email and password are required"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "A user with this email address already exists"));
        }

        Department department = null;
        if (departmentId != null) {
            department = departmentRepository.findById(departmentId).orElse(null);
        }

        Enums.UserRole role;
        try {
            role = Enums.UserRole.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            role = Enums.UserRole.STUDENT_ORGANIZER;
        }

        User newUser = new User();
        newUser.setId("USR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role);
        newUser.setDepartment(department);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setAccountStatus("ACTIVE");

        User savedUser = userRepository.save(newUser);

        String deptId = savedUser.getDepartment() != null ? savedUser.getDepartment().getId() : "";
        String token = jwtUtils.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getId(),
                savedUser.getFullName(),
                deptId
        );

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
                "id", savedUser.getId(),
                "fullName", savedUser.getFullName(),
                "email", savedUser.getEmail(),
                "role", savedUser.getRole().name(),
                "departmentId", deptId,
                "accountStatus", savedUser.getAccountStatus()
        ));

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String token = authHeader.substring(7);
        if (!jwtUtils.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token is invalid or expired"));
        }

        String email = jwtUtils.getEmailFromToken(token);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        String deptId = user.getDepartment() != null ? user.getDepartment().getId() : "";
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "departmentId", deptId,
                "accountStatus", user.getAccountStatus(),
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : ""
        ));
    }
}
