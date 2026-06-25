package com.learning.project.hospitalManagement.Security;

import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.descriptor.web.SessionConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.SessionManagementDsl;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class WebSecurityConfig {


    private final JwtAuthFilter jwtAuthFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(csrfConfig -> csrfConfig.disable())
                .sessionManagement(sessionConfig ->
                        sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth->auth
                    .requestMatchers("/", "/index.html", "/css/**", "/js/**", "/assets/**", "/favicon.ico").permitAll()
                    .requestMatchers("/public/**" , "/auth/**", "/error").permitAll()
                    .requestMatchers("/admin/**").hasRole("ADMIN")
                    .requestMatchers("/doctors/**").hasAnyRole("DOCTOR" , "ADMIN")
                    .requestMatchers("/patients/**").hasAnyRole("PATIENT", "ADMIN")
                    .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthFilter , UsernamePasswordAuthenticationFilter.class);

        ;
//                .formLogin(Customizer.withDefaults());


        return httpSecurity.build();
    }

}
