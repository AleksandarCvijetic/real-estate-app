package com.realestate.configurationserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@EnableConfigServer
@SpringBootApplication
public class ConfigurationserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigurationserverApplication.class, args);
	}

}
