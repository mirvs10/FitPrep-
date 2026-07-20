package com.fitprep.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.model.PasswordHasher;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner initSuperAdmin(UsuarioRepositoryPort usuarioRepository, PasswordHasher passwordHasher) {
		return args -> {
			if (usuarioRepository.findByEmail("admin@fitprep.com").isEmpty()) {
				Usuario admin = Usuario.builder()
						.nombres("Super")
						.apellidos("Admin")
						.email("admin@fitprep.com")
						.passwordHash(passwordHasher.hash("123456"))
						.rol("ADMIN")
						.negocioId(1)
						.build();
				usuarioRepository.saveWithTenant(admin, 1);
				System.out.println("✅ SuperAdmin creado correctamente (admin@fitprep.com / 123456)");
			}
		};
	}

}
