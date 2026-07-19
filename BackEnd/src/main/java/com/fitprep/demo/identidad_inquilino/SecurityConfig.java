package com.fitprep.demo.identidad_inquilino;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final TenantFilter tenantFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, TenantFilter tenantFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.tenantFilter = tenantFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOriginPatterns(java.util.List.of("*"));
                config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(java.util.List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/platos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/platos/**").hasAnyRole("TENANT", "ADMIN", "ADMIN_TENANT")
                .requestMatchers(HttpMethod.PUT, "/api/v1/platos/**").hasAnyRole("TENANT", "ADMIN", "ADMIN_TENANT")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/platos/**").hasAnyRole("TENANT", "ADMIN", "ADMIN_TENANT")
                // Listar TODOS los pedidos del negocio: solo TENANT/ADMIN.
                .requestMatchers(HttpMethod.GET, "/api/v1/planes").hasAnyRole("TENANT", "ADMIN", "ADMIN_TENANT")
                .requestMatchers("/api/v1/planes/**").authenticated()
                .requestMatchers("/api/v1/usuarios/**").hasAnyRole("TENANT", "ADMIN", "ADMIN_TENANT")
                .requestMatchers(HttpMethod.GET, "/api/v1/negocios/all").permitAll()
                .requestMatchers("/api/v1/negocios/**").hasAnyRole("TENANT", "ADMIN", "ADMIN_TENANT")
                .requestMatchers(HttpMethod.POST, "/api/v1/admin/seed").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/pedidos/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(tenantFilter, JwtAuthenticationFilter.class);

        return http.build();
    }
}
