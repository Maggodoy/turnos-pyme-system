# 🗓️ Sistema de Gestión de Turnos - PyME (MVP)

> Prototipo web modular para la reserva y administración de citas orientado a PyMEs, diseñado bajo arquitectura desacoplada (**Clean Architecture / MVC**) y buenas prácticas de desarrollo de software.

---

## 📐 Arquitectura del Sistema

El proyecto está estructurado siguiendo el principio de **Separación de Responsabilidades (SoC)**, dividiendo estrictamente la interfaz de usuario de la lógica de negocio y persistencia.

```text
turnos-pyme-system/
├── client/                      # FRONTEND (UI & API Connector)
│   ├── index.html               # Estructura semántica
│   ├── css/
│   │   └── styles.css           # Estética minimalista Japandi
│   └── js/
│       ├── main.js              # Entry point / Bootstrapper
│       ├── components/          # Componentes de interfaz (BookingForm)
│       └── services/            # Cliente HTTP (ApiService)
│
├── server/                      # BACKEND (Lógica de Dominio & API)
│   ├── config/
│   │   └── businessRules.js     # Centralización de reglas (BR-001 a BR-005)
│   ├── controllers/             # Manejo de peticiones/respuestas HTTP
│   │   └── appointmentController.js
│   ├── services/                # Lógica de negocio
│   │   └── appointmentService.js
│   └── database/                # Adaptador de persistencia (LocalStorage)
│       └── dbAdapter.js
│
└── docs/                        # DOCUMENTACIÓN FUNCIONAL
    └── functional/
        ├── business-rules.md
        └── user-stories.md

💼 Reglas de Negocio Implementadas (BRD)
BR-001 (Reserva Temporal): Bloqueo preventivo de slots durante 15 minutos pendientes de confirmación.

BR-002 (Control de Concurrencia): Validación a nivel servidor para evitar reservas duplicadas en el mismo horario.

BR-003 (Política de Cancelación): Cancelaciones permitidas con un mínimo de 24 horas de anticipación.

BR-004 (Gestión de No-Shows): Control de inasistencias y bloqueo automático ante reincidencias.

BR-005 (Límite de Reservas Simultáneas): Máximo de 2 turnos activos simultáneos por cliente.

🛠️ Tecnologías y Patrones Aplicados
Frontend: HTML5 Semántico, CSS3 (Custom Properties & Flexbox), ES6+ JavaScript Modules.

Backend Simulado: Architecture Layered (Controller-Service-Adapter), REST API Standards.

Patrones de Diseño: Adapter Pattern, Single Responsibility Principle (SRP), Fail-Fast Validation.

UX/UI: Diseño accesible y responsivo basado en paleta Japandi.       