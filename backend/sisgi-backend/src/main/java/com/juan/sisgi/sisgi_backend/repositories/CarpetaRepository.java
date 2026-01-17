package com.juan.sisgi.sisgi_backend.repositories;

import com.juan.sisgi.sisgi_backend.models.Carpeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarpetaRepository extends JpaRepository<Carpeta, Long> {
    List<Carpeta> findByParentIsNull();
    List<Carpeta> findByParentId(Long parentId);
}
