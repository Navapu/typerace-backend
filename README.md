# TypeRace Backend

Backend para la aplicación TypeRace, un juego de mecanografía en tiempo real. Proporciona autenticación, gestión de partidas, textos y usuarios, así como integración con Google OAuth y manejo de tokens seguros.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Uso](#uso)
- [Endpoints Principales](#endpoints-principales)
- [Tareas Programadas y Workers](#tareas-programadas-y-workers)
- [Licencia](#licencia)

---

## Descripción
Este backend gestiona la lógica y persistencia de datos para el juego TypeRace. Permite a los usuarios autenticarse (incluyendo Google OAuth), unirse a partidas, obtener textos para competir y gestionar su progreso. Incluye protección contra abusos mediante rate limiting y limpieza automática de tokens.

## Tecnologías
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (BullMQ para colas)
- Passport.js (Google OAuth 2.0)
- JWT (autenticación)
- Pino (logging)
- Docker (para Redis)

## Estructura del Proyecto
```
├── config/           # Configuración de entorno, logger, passport, redis
├── controllers/      # Lógica de rutas (auth, game, health, text)
├── db/               # Conexión y modelos de MongoDB
├── middleware/       # Middlewares de autenticación, errores, rate limit
├── queues/           # Definición de colas BullMQ
├── routes/           # Definición de rutas Express
├── services/         # Lógica de negocio (auth, limpieza de tokens)
├── utils/            # Helpers y utilidades
├── workers/          # Workers para procesamiento en background
├── index.js          # Entry point principal
├── docker-compose.yml# Orquestación de servicios (Redis)
├── package.json      # Dependencias y scripts
```

## Instalación
1. Clona el repositorio:
	```bash
	git clone https://github.com/Navapu/typerace-backend.git
	cd typerace-backend
	```
2. Instala las dependencias:
	```bash
	npm install
	```
3. Configura las variables de entorno (ver sección siguiente).
4. (Opcional) Levanta Redis con Docker:
	```bash
	docker-compose up -d
	```

## Variables de Entorno
Crea un archivo `.env` en la raíz con el siguiente contenido de ejemplo:

```env
PORT=3000
BACKEND_URL=http://localhost:
NODE_ENV=development
DB_USER=usuario
DB_PASS=contraseña
CLUSTER=cluster.mongodb.net
DATABASE=typerace
JWT_SECRET=tu_jwt_secret
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_REDIRECT_URI=tu_google_redirect_uri
```

## Uso
Para desarrollo:
```bash
npm run dev
```
El servidor estará disponible en `http://localhost:3000` (o el puerto configurado).

## Endpoints Principales

### Auth
- `POST /auth/register` — Registro de usuario
- `POST /auth/login` — Login con usuario y contraseña
- `GET /auth/google` — Login con Google OAuth
- `POST /auth/refresh` — Refrescar token JWT
- `POST /auth/logout` — Logout

### Textos
- `GET /texts` — Obtener textos para competir
- `POST /texts` — Crear texto (admin)

### Juegos
- `POST /games` — Crear nueva partida
- `GET /games/:id` — Obtener estado de partida
- `POST /games/:id/join` — Unirse a partida

### Health
- `GET /health` — Chequeo de salud del backend

## Tareas Programadas y Workers
- **Cron diario:** Limpieza de tokens de refresco expirados (`workers/cleanupRefreshTokens.worker.js`)
- **BullMQ:** Gestión de colas para tareas asíncronas y limpieza de tokens

## Licencia
ISC
