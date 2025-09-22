-- Script para cargar servicios de ejemplo en la base de datos
-- Basado en la estructura de la tabla services existente

-- Servicios de construcción y mantenimiento
INSERT INTO services (
  id,
  name,
  description,
  category,
  contact_name,
  contact_phone,
  contact_email,
  contact_whatsapp,
  address,
  latitude,
  longitude,
  website,
  working_hours,
  images,
  is_active,
  created_at,
  updated_at
) VALUES 
-- Electricista
(
  gen_random_uuid(),
  'Electricista Profesional - José Martínez',
  'Servicios eléctricos residenciales y comerciales. Instalaciones, reparaciones, mantenimiento. 15 años de experiencia. Licencia profesional.',
  'electricista',
  'José Martínez',
  '+1-555-0101',
  'jose.electricista@email.com',
  '+1-555-0101',
  '123 Main Street, Miami, FL 33101',
  25.7617,
  -80.1918,
  'https://joseelectricista.com',
  '{"lunes": "8:00-18:00", "martes": "8:00-18:00", "miercoles": "8:00-18:00", "jueves": "8:00-18:00", "viernes": "8:00-18:00", "sabado": "9:00-15:00", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Plomero
(
  gen_random_uuid(),
  'Plomería Rápida - Carlos Rodríguez',
  'Servicios de plomería 24/7. Reparaciones de emergencia, instalación de tuberías, destapes. Servicio garantizado.',
  'plomero',
  'Carlos Rodríguez',
  '+1-555-0102',
  'carlos.plomeria@email.com',
  '+1-555-0102',
  '456 Oak Avenue, Miami, FL 33102',
  25.7717,
  -80.1818,
  null,
  '{"lunes": "24 horas", "martes": "24 horas", "miercoles": "24 horas", "jueves": "24 horas", "viernes": "24 horas", "sabado": "24 horas", "domingo": "24 horas"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Carpintero
(
  gen_random_uuid(),
  'Carpintería Artesanal - Miguel Santos',
  'Muebles a medida, reparaciones, instalación de gabinetes. Trabajo en madera de alta calidad. Presupuestos gratuitos.',
  'carpintero',
  'Miguel Santos',
  '+1-555-0103',
  'miguel.carpinteria@email.com',
  '+1-555-0103',
  '789 Pine Street, Miami, FL 33103',
  25.7817,
  -80.1718,
  'https://carpinteriamiguel.com',
  '{"lunes": "7:00-17:00", "martes": "7:00-17:00", "miercoles": "7:00-17:00", "jueves": "7:00-17:00", "viernes": "7:00-17:00", "sabado": "8:00-14:00", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Pintor
(
  gen_random_uuid(),
  'Pintura Profesional - Ana García',
  'Pintura interior y exterior, residencial y comercial. Acabados de alta calidad. Materiales incluidos.',
  'pintor',
  'Ana García',
  '+1-555-0104',
  'ana.pintura@email.com',
  '+1-555-0104',
  '321 Elm Street, Miami, FL 33104',
  25.7917,
  -80.1618,
  null,
  '{"lunes": "8:00-16:00", "martes": "8:00-16:00", "miercoles": "8:00-16:00", "jueves": "8:00-16:00", "viernes": "8:00-16:00", "sabado": "cerrado", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Jardinero
(
  gen_random_uuid(),
  'Jardines Verdes - Roberto Flores',
  'Mantenimiento de jardines, diseño paisajístico, poda de árboles. Servicio semanal o mensual disponible.',
  'jardinero',
  'Roberto Flores',
  '+1-555-0105',
  'roberto.jardines@email.com',
  '+1-555-0105',
  '654 Cedar Avenue, Miami, FL 33105',
  25.8017,
  -80.1518,
  'https://jardinesverdes.com',
  '{"lunes": "7:00-15:00", "martes": "7:00-15:00", "miercoles": "7:00-15:00", "jueves": "7:00-15:00", "viernes": "7:00-15:00", "sabado": "8:00-12:00", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Limpieza
(
  gen_random_uuid(),
  'Limpieza Perfecta - María López',
  'Servicios de limpieza residencial y comercial. Limpieza profunda, mantenimiento regular. Personal confiable y asegurado.',
  'limpieza',
  'María López',
  '+1-555-0106',
  'maria.limpieza@email.com',
  '+1-555-0106',
  '987 Maple Street, Miami, FL 33106',
  25.8117,
  -80.1418,
  null,
  '{"lunes": "8:00-18:00", "martes": "8:00-18:00", "miercoles": "8:00-18:00", "jueves": "8:00-18:00", "viernes": "8:00-18:00", "sabado": "9:00-15:00", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Construcción
(
  gen_random_uuid(),
  'Construcciones Sólidas - Pedro Morales',
  'Construcción y remodelación. Ampliaciones, renovaciones completas. Licencia de contratista general.',
  'construccion',
  'Pedro Morales',
  '+1-555-0107',
  'pedro.construccion@email.com',
  '+1-555-0107',
  '147 Birch Avenue, Miami, FL 33107',
  25.8217,
  -80.1318,
  'https://construccionessolidas.com',
  '{"lunes": "7:00-17:00", "martes": "7:00-17:00", "miercoles": "7:00-17:00", "jueves": "7:00-17:00", "viernes": "7:00-17:00", "sabado": "cerrado", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Mecánico
(
  gen_random_uuid(),
  'Taller Mecánico - Luis Herrera',
  'Reparación de automóviles, mantenimiento preventivo, diagnóstico computarizado. Especialistas en vehículos latinos.',
  'mecanico',
  'Luis Herrera',
  '+1-555-0108',
  'luis.mecanico@email.com',
  '+1-555-0108',
  '258 Walnut Street, Miami, FL 33108',
  25.8317,
  -80.1218,
  null,
  '{"lunes": "8:00-18:00", "martes": "8:00-18:00", "miercoles": "8:00-18:00", "jueves": "8:00-18:00", "viernes": "8:00-18:00", "sabado": "8:00-14:00", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Veterinario
(
  gen_random_uuid(),
  'Clínica Veterinaria - Dra. Carmen Ruiz',
  'Atención veterinaria completa para mascotas. Consultas, vacunas, cirugías. Emergencias 24/7.',
  'veterinario',
  'Dra. Carmen Ruiz',
  '+1-555-0109',
  'carmen.veterinaria@email.com',
  '+1-555-0109',
  '369 Cherry Lane, Miami, FL 33109',
  25.8417,
  -80.1118,
  'https://veterinariacarmen.com',
  '{"lunes": "9:00-19:00", "martes": "9:00-19:00", "miercoles": "9:00-19:00", "jueves": "9:00-19:00", "viernes": "9:00-19:00", "sabado": "9:00-15:00", "domingo": "emergencias"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Médico
(
  gen_random_uuid(),
  'Consulta Médica - Dr. Fernando Silva',
  'Medicina general, consultas familiares. Atención en español. Seguros médicos aceptados.',
  'medico',
  'Dr. Fernando Silva',
  '+1-555-0110',
  'fernando.medico@email.com',
  '+1-555-0110',
  '741 Peach Street, Miami, FL 33110',
  25.8517,
  -80.1018,
  'https://consultamedica.com',
  '{"lunes": "9:00-17:00", "martes": "9:00-17:00", "miercoles": "9:00-17:00", "jueves": "9:00-17:00", "viernes": "9:00-17:00", "sabado": "cerrado", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Abogado
(
  gen_random_uuid(),
  'Bufete Legal - Lic. Patricia Vega',
  'Servicios legales especializados en inmigración, familia, accidentes. Consulta inicial gratuita.',
  'abogado',
  'Lic. Patricia Vega',
  '+1-555-0111',
  'patricia.abogada@email.com',
  '+1-555-0111',
  '852 Orange Avenue, Miami, FL 33111',
  25.8617,
  -80.0918,
  'https://bufetevega.com',
  '{"lunes": "9:00-18:00", "martes": "9:00-18:00", "miercoles": "9:00-18:00", "jueves": "9:00-18:00", "viernes": "9:00-18:00", "sabado": "cerrado", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Contador
(
  gen_random_uuid(),
  'Contabilidad Profesional - CPA Juan Mendoza',
  'Servicios contables, preparación de impuestos, asesoría financiera. Especialistas en pequeños negocios.',
  'contador',
  'CPA Juan Mendoza',
  '+1-555-0112',
  'juan.contador@email.com',
  '+1-555-0112',
  '963 Grape Street, Miami, FL 33112',
  25.8717,
  -80.0818,
  'https://contabilidadmendoza.com',
  '{"lunes": "9:00-17:00", "martes": "9:00-17:00", "miercoles": "9:00-17:00", "jueves": "9:00-17:00", "viernes": "9:00-17:00", "sabado": "cerrado", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Profesor
(
  gen_random_uuid(),
  'Clases de Inglés - Prof. Sandra Torres',
  'Clases de inglés para adultos e inmigrantes. Preparación para ciudadanía. Clases grupales e individuales.',
  'profesor',
  'Prof. Sandra Torres',
  '+1-555-0113',
  'sandra.profesora@email.com',
  '+1-555-0113',
  '174 Apple Lane, Miami, FL 33113',
  25.8817,
  -80.0718,
  null,
  '{"lunes": "16:00-21:00", "martes": "16:00-21:00", "miercoles": "16:00-21:00", "jueves": "16:00-21:00", "viernes": "16:00-21:00", "sabado": "9:00-15:00", "domingo": "cerrado"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Restaurante
(
  gen_random_uuid(),
  'Restaurante La Tradición - Chef Mario Castillo',
  'Comida latina auténtica. Especialidades de varios países. Servicio de catering disponible.',
  'restaurante',
  'Chef Mario Castillo',
  '+1-555-0114',
  'mario.restaurante@email.com',
  '+1-555-0114',
  '285 Banana Street, Miami, FL 33114',
  25.8917,
  -80.0618,
  'https://latradicion.com',
  '{"lunes": "11:00-22:00", "martes": "11:00-22:00", "miercoles": "11:00-22:00", "jueves": "11:00-22:00", "viernes": "11:00-23:00", "sabado": "11:00-23:00", "domingo": "12:00-21:00"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Supermercado
(
  gen_random_uuid(),
  'Supermercado El Pueblo - Familia Jiménez',
  'Productos latinos, carnes frescas, envíos de dinero. Productos de toda Latinoamérica.',
  'supermercado',
  'Familia Jiménez',
  '+1-555-0115',
  'contacto.supermercado@email.com',
  '+1-555-0115',
  '396 Coconut Avenue, Miami, FL 33115',
  25.9017,
  -80.0518,
  null,
  '{"lunes": "8:00-21:00", "martes": "8:00-21:00", "miercoles": "8:00-21:00", "jueves": "8:00-21:00", "viernes": "8:00-21:00", "sabado": "8:00-21:00", "domingo": "9:00-20:00"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
),

-- Farmacia
(
  gen_random_uuid(),
  'Farmacia Salud - Farm. Elena Moreno',
  'Medicamentos, productos de salud, consultas farmacéuticas. Entrega a domicilio disponible.',
  'farmacia',
  'Farm. Elena Moreno',
  '+1-555-0116',
  'elena.farmacia@email.com',
  '+1-555-0116',
  '507 Mango Street, Miami, FL 33116',
  25.9117,
  -80.0418,
  'https://farmaciasalud.com',
  '{"lunes": "8:00-20:00", "martes": "8:00-20:00", "miercoles": "8:00-20:00", "jueves": "8:00-20:00", "viernes": "8:00-20:00", "sabado": "9:00-18:00", "domingo": "10:00-16:00"}',
  ARRAY['/placeholder.svg?height=300&width=400'],
  true,
  NOW(),
  NOW()
);
