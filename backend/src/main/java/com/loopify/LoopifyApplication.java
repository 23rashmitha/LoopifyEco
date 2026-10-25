package com.loopify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LoopifyApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoopifyApplication.class, args);
        System.out.println("=========================================================");
        System.out.println("🚀 Loopify Campus Spring Boot API Server Started on 8080");
        System.out.println("🌐 Connected endpoints at http://localhost:8080/api/v1");
        System.out.println("💡 Ready to accept requests from React frontend on port 3000");
        System.out.println("=========================================================");
    }
}
