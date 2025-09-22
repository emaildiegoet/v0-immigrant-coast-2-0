-- Script para eliminar todos los servicios de ejemplo creados anteriormente
-- Este script elimina los servicios basándose en los nombres y emails únicos que se crearon

DELETE FROM services WHERE name IN (
  'Electricista Profesional Miami',
  'Plomería Rápida 24/7',
  'Construcción y Remodelación',
  'Limpieza Residencial Premium',
  'Jardinería y Paisajismo',
  'Mecánico Automotriz Confiable',
  'Restaurante La Havana',
  'Supermercado El Pueblo',
  'Farmacia San José',
  'Peluquería Bella Vista',
  'Dr. María González - Medicina General',
  'Abogado de Inmigración',
  'Contador Público Certificado',
  'Academia de Inglés Miami',
  'Agencia de Viajes Mundo',
  'Taller de Costura y Alteraciones'
);

-- Verificar cuántos servicios fueron eliminados
SELECT COUNT(*) as servicios_restantes FROM services;
