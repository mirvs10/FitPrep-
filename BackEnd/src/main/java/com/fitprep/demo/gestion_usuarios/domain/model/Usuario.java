package com.fitprep.demo.gestion_usuarios.domain.model;

/**
 * Modelo de dominio puro del usuario (deportista / administrador de tenant).
 */
public class Usuario {

    private Long id;
    private Integer negocioId;
    private String nombres;
    private String apellidos;
    private String email;
    private String passwordHash;
    private String rol;
    private String objetivoFitness;
    private Double requerimientoKcal;
    private Double reqProteinasG;
    private Double reqCarbohidratosG;
    private Double reqGrasasG;

    public Usuario() {
        this.rol = "ATHLETE";
    }

    public boolean passwordCoincide(String rawPassword, PasswordHasher hasher) {
        return hasher.matches(rawPassword, this.passwordHash);
    }

    /**
     * Regla de negocio: actualiza el perfil nutricional del usuario. Los
     * requerimientos no pueden ser negativos.
     */
    public void actualizarObjetivos(String objetivoFitness, Double requerimientoKcal,
                                    Double reqProteinasG, Double reqCarbohidratosG, Double reqGrasasG) {
        validarNoNegativo(requerimientoKcal, "requerimiento calórico");
        validarNoNegativo(reqProteinasG, "proteínas");
        validarNoNegativo(reqCarbohidratosG, "carbohidratos");
        validarNoNegativo(reqGrasasG, "grasas");

        this.objetivoFitness = objetivoFitness;
        this.requerimientoKcal = requerimientoKcal;
        this.reqProteinasG = reqProteinasG;
        this.reqCarbohidratosG = reqCarbohidratosG;
        this.reqGrasasG = reqGrasasG;
    }

    private static void validarNoNegativo(Double valor, String campo) {
        if (valor != null && valor < 0) {
            throw new IllegalArgumentException("El valor de " + campo + " no puede ser negativo.");
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNegocioId() { return negocioId; }
    public void setNegocioId(Integer negocioId) { this.negocioId = negocioId; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getObjetivoFitness() { return objetivoFitness; }
    public void setObjetivoFitness(String objetivoFitness) { this.objetivoFitness = objetivoFitness; }

    public Double getRequerimientoKcal() { return requerimientoKcal; }
    public void setRequerimientoKcal(Double requerimientoKcal) { this.requerimientoKcal = requerimientoKcal; }

    public Double getReqProteinasG() { return reqProteinasG; }
    public void setReqProteinasG(Double reqProteinasG) { this.reqProteinasG = reqProteinasG; }

    public Double getReqCarbohidratosG() { return reqCarbohidratosG; }
    public void setReqCarbohidratosG(Double reqCarbohidratosG) { this.reqCarbohidratosG = reqCarbohidratosG; }

    public Double getReqGrasasG() { return reqGrasasG; }
    public void setReqGrasasG(Double reqGrasasG) { this.reqGrasasG = reqGrasasG; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Usuario u = new Usuario();
        public Builder id(Long v) { u.id = v; return this; }
        public Builder negocioId(Integer v) { u.negocioId = v; return this; }
        public Builder nombres(String v) { u.nombres = v; return this; }
        public Builder apellidos(String v) { u.apellidos = v; return this; }
        public Builder email(String v) { u.email = v; return this; }
        public Builder passwordHash(String v) { u.passwordHash = v; return this; }
        public Builder rol(String v) { u.rol = v; return this; }
        public Builder objetivoFitness(String v) { u.objetivoFitness = v; return this; }
        public Builder requerimientoKcal(Double v) { u.requerimientoKcal = v; return this; }
        public Builder reqProteinasG(Double v) { u.reqProteinasG = v; return this; }
        public Builder reqCarbohidratosG(Double v) { u.reqCarbohidratosG = v; return this; }
        public Builder reqGrasasG(Double v) { u.reqGrasasG = v; return this; }
        public Usuario build() { return u; }
    }
}
