package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

interface PedidoEcommerceJpaRepository extends JpaRepository<PedidoEcommerceEntity, Long> {
    List<PedidoEcommerceEntity> findByUsuarioId(Long usuarioId);
    List<PedidoEcommerceEntity> findByNegocioId(Integer negocioId);
}
