# 🏢 Sistema de Gestión de Equipos - Backend

Sistema backend robusto para la gestión de equipos tecnológicos, usuarios y asignaciones, implementado con Node.js, Express, TypeScript y MongoDB. El proyecto está diseñado siguiendo los principios SOLID y patrones de diseño orientados a objetos.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Patrones de Diseño](#-patrones-de-diseño)
- [Principios SOLID](#-principios-solid)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Sistema de Roles](#-sistema-de-roles)
- [Validaciones](#-validaciones)

## ✨ Características

- **Autenticación y Autorización**: Sistema JWT con control de acceso basado en roles
- **Gestión de Usuarios**: CRUD completo con diferentes niveles de permisos
- **Gestión de Equipos**: Registro, asignación y seguimiento de equipos tecnológicos
- **Sistema de Notificaciones**: Observadores que rastrean cambios de estado
- **Validaciones Robustas**: Validación de datos con express-validator
- **Arquitectura Escalable**: Inyección de dependencias y separación de responsabilidades
- **Tipado Fuerte**: TypeScript para mayor seguridad y mantenibilidad

## 🛠 Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Lenguaje**: TypeScript
- **Base de Datos**: MongoDB con Mongoose 8.18.3
- **Autenticación**: JWT (jsonwebtoken 9.0.2)
- **Encriptación**: bcrypt 6.0.0
- **Validación**: express-validator 7.2.1
- **Otras**: cors, morgan, dotenv

## 🏗 Arquitectura

El proyecto sigue una arquitectura por capas con inyección de dependencias:

```
┌─────────────────────────────────────────┐
│         Controllers (HTTP Layer)        │
├─────────────────────────────────────────┤
│         Services (Business Logic)       │
├─────────────────────────────────────────┤
│      Repositories (Data Access)         │
├─────────────────────────────────────────┤
│         Database (MongoDB)              │
└─────────────────────────────────────────┘
```

### Inyección de Dependencias

El sistema utiliza un **Contenedor de Inyección de Dependencias** (`DIContainer`) que:

- Gestiona instancias únicas (Singleton) de repositorios, servicios y controladores
- Elimina duplicación de instancias
- Centraliza la configuración de dependencias
- Facilita el testing mediante mocking

**Ubicación**: `src/configs/dependencies.config.ts`

## 🎨 Patrones de Diseño

### 1. Singleton Pattern

**Implementaciones**:

#### Database Connection

```typescript
// src/database/ConectionDB.ts
class ConectionDB {
  private static instance: ConectionDB;

  public static getInstance(conectionDB: IDatabase): ConectionDB {
    if (!ConectionDB.instance) {
      ConectionDB.instance = new ConectionDB(conectionDB);
    }
    return ConectionDB.instance;
  }
}
```

**Beneficio**: Garantiza una única conexión a la base de datos durante toda la vida de la aplicación.

#### Dependency Injection Container

```typescript
// src/middlewares/dependencyInyection.ts
class DIContainer {
  private instances = new Map<string, any>();

  registerInstance<T>(token: string, instance: T): void {
    this.instances.set(token, instance);
  }

  resolve<T>(token: string): T {
    return this.instances.get(token);
  }
}

export const container = new DIContainer();
```

**Beneficio**: Una única instancia del contenedor que gestiona todas las dependencias de la aplicación.

### 2. Adapter Pattern

**Implementación**: Adaptador de base de datos para MongoDB

```typescript
// src/database/interfaces/IDatabase.ts
interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

// src/configs/mongo.config.ts
class MongoConfig implements IDatabase {
  public async connect(): Promise<void> {
    await mongoose.connect(envs.MONGO_URI!);
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
```

**Beneficio**: Permite cambiar la implementación de la base de datos (de MongoDB a PostgreSQL, por ejemplo) sin modificar el código que la utiliza.

### 3. Factory Pattern

**Implementación**: Fábrica para creación de equipos

```typescript
// src/equipment/factories/EquipmentFactory.ts
abstract class EquipmentFactory {
  abstract createEquipment(data: EquipmentCreationData): Equipment;

  public create(data: EquipmentCreationData) {
    this.validateData(data);
    return this.createEquipment(data);
  }
}

class LaptopFactory extends EquipmentFactory {
  createEquipment(data: EquipmentCreationData) {
    return { ...data, type: EquipmentType.LAPTOP };
  }
}

class MonitorFactory extends EquipmentFactory {
  createEquipment(data: EquipmentCreationData) {
    return { ...data, type: EquipmentType.MONITOR };
  }
}

class EquipmentFactoryManager {
  private static factories = new Map<EquipmentType, EquipmentFactory>([
    [EquipmentType.LAPTOP, new LaptopFactory()],
    [EquipmentType.MONITOR, new MonitorFactory()],
    [EquipmentType.PRINTER, new PrinterFactory()],
  ]);

  static createEquipment(type: EquipmentType, data: EquipmentCreationData) {
    const factory = this.getFactory(type);
    return factory.create(data);
  }
}
```

**Beneficio**: Encapsula la lógica de creación de diferentes tipos de equipos, facilitando la extensión con nuevos tipos.

### 4. Observer Pattern

**Implementación**: Sistema de notificaciones para cambios de estado de equipos

```typescript
// src/equipment/interfaces/IObserver.ts
interface IObserver {
  update(
    equipmentId: string,
    oldStatus: EquipmentStatus,
    newStatus: EquipmentStatus,
    equipmentName: string
  ): void;
}

interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(...args: any[]): void;
}

// src/equipment/equipment.service.ts
class EquipmentService implements ISubject {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    this.observers.push(observer);
  }

  notify(
    equipmentId: string,
    oldStatus: EquipmentStatus,
    newStatus: EquipmentStatus,
    equipmentName: string
  ): void {
    for (const observer of this.observers) {
      observer.update(equipmentId, oldStatus, newStatus, equipmentName);
    }
  }
}

// Observers concretos
class AdminNotifierObserver implements IObserver {
  update(equipmentId, oldStatus, newStatus, equipmentName): void {
    console.log(
      `Notificación: ${equipmentName} cambió de ${oldStatus} a ${newStatus}`
    );
  }
}

class HistoryLoggerObserver implements IObserver {
  private logs = [];

  update(equipmentId, oldStatus, newStatus, equipmentName): void {
    this.logs.push({
      equipmentId,
      oldStatus,
      newStatus,
      timestamp: new Date(),
    });
  }
}
```

**Beneficio**: Desacopla la lógica de negocio de las notificaciones. Permite agregar nuevos observadores sin modificar el servicio de equipos.

### 5. Repository Pattern

**Implementación**: Abstracción de acceso a datos

```typescript
// src/user/repositories/UserRepository.ts
interface IUserRepository {
  create(userData: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(page: number, limit: number): Promise<User[]>;
  update(id: string, userData: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

class UserRepository implements IUserRepository {
  async create(userData: CreateUserDto): Promise<User> {
    const user = await UserModel.create(userData);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }
}
```

**Beneficio**: Separa la lógica de acceso a datos de la lógica de negocio, facilitando el testing y el cambio de tecnología de persistencia.

## 🎯 Principios SOLID

### 1. Single Responsibility Principle (SRP)

Cada clase tiene una única responsabilidad:

- **Controllers**: Manejan solicitudes HTTP y respuestas
- **Services**: Contienen la lógica de negocio
- **Repositories**: Gestionan el acceso a datos
- **Validators**: Validan datos de entrada
- **Observers**: Notifican cambios de estado

**Ejemplo**:

```typescript
// UserController: solo maneja HTTP
class UserController {
  constructor(private userService: IUserService) {}

  public createUser = async (req: Request, res: Response) => {
    const userData = req.body;
    const newUser = await this.userService.createUser(userData);
    return res.status(201).json({ success: true, data: newUser });
  };
}

// UserService: solo lógica de negocio
class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.mapToResponse(newUser);
  }
}
```

### 2. Open/Closed Principle (OCP)

El sistema está abierto a extensión pero cerrado a modificación:

- **Factory Pattern**: Nuevos tipos de equipos se agregan sin modificar código existente
- **Observer Pattern**: Nuevos observadores se agregan sin modificar EquipmentService

**Ejemplo**:

```typescript
// Agregar un nuevo tipo de equipo sin modificar código existente
class TabletFactory extends EquipmentFactory {
  createEquipment(data: EquipmentCreationData) {
    return { ...data, type: EquipmentType.TABLET };
  }
}

// Agregar un nuevo observer sin modificar EquipmentService
class EmailNotifierObserver implements IObserver {
  update(equipmentId, oldStatus, newStatus, equipmentName): void {
    sendEmail(`Equipment ${equipmentName} changed status`);
  }
}
```

### 3. Liskov Substitution Principle (LSP)

Las implementaciones pueden sustituir a sus interfaces sin alterar el comportamiento:

```typescript
// Cualquier implementación de IDatabase puede sustituir a otra
interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

// MongoDB puede ser reemplazado por PostgreSQL sin cambiar ConectionDB
class PostgresConfig implements IDatabase {
  async connect(): Promise<void> {
    // Implementación para PostgreSQL
  }
}

ConectionDB.getInstance(new MongoConfig()); // o
ConectionDB.getInstance(new PostgresConfig());
```

### 4. Interface Segregation Principle (ISP)

Las interfaces son específicas y no obligan a implementar métodos innecesarios:

```typescript
// Interfaces segregadas en lugar de una interfaz grande
interface IAuthService {
  login(email: string, password: string): Promise<AuthResult>;
  session(token: string): Promise<AuthResult>;
  logout(): Promise<AuthResult>;
}

interface IUserService {
  createUser(userData: CreateUserDto): Promise<UserResponseDto>;
  getUserById(id: string): Promise<UserResponseDto | null>;
  // ... solo métodos relacionados con usuarios
}
```

### 5. Dependency Inversion Principle (DIP)

Las clases de alto nivel no dependen de clases de bajo nivel, ambas dependen de abstracciones:

```typescript
// Service depende de interfaz, no de implementación concreta
class AuthService implements IAuthService {
  constructor(private userService: IUserService) {} // Interfaz, no UserService
}

class EquipmentService implements IEquipmentService {
  constructor(private equipmentRepository: IEquipmentRepository) {} // Interfaz
}

// Inyección configurada centralmente
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userService);
```

## 📁 Estructura del Proyecto

```
tp-backend-poo/
├── src/
│   ├── auth/                      # Módulo de autenticación
│   │   ├── DTOs/
│   │   │   └── authDTO.ts
│   │   ├── interfaces/
│   │   │   └── IAuthService.ts
│   │   ├── validations/
│   │   │   └── auth.validation.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── configs/                   # Configuraciones
│   │   ├── dependencies.config.ts # Inyección de dependencias
│   │   ├── envs.config.ts
│   │   └── mongo.config.ts        # Adapter de MongoDB
│   │
│   ├── database/                  # Gestión de base de datos
│   │   ├── interfaces/
│   │   │   └── IDatabase.ts
│   │   ├── ConectionDB.ts         # Singleton
│   │   └── seed.ts
│   │
│   ├── equipment/                 # Módulo de equipos
│   │   ├── DTOs/
│   │   │   └── equipmentDTO.ts
│   │   ├── entities/
│   │   │   └── equipmentEntity.ts
│   │   ├── factories/             # Factory Pattern
│   │   │   └── EquipmentFactory.ts
│   │   ├── interfaces/
│   │   │   ├── IEquipmentRepository.ts
│   │   │   ├── IEquipmentService.ts
│   │   │   └── IObserver.ts
│   │   ├── models/
│   │   │   ├── assignment.model.ts
│   │   │   └── equipment.model.ts
│   │   ├── observers/             # Observer Pattern
│   │   │   ├── AdminNotifierObserver.ts
│   │   │   └── HistoryLoggerObserver.ts
│   │   ├── repositories/
│   │   │   └── EquipmentRepository.ts
│   │   ├── validations/
│   │   │   └── equipment.validation.ts
│   │   ├── equipment.controller.ts
│   │   ├── equipment.module.ts
│   │   └── equipment.service.ts
│   │
│   ├── helpers/
│   │   ├── handleValidationErrors.ts
│   │   └── JWT.ts
│   │
│   ├── middlewares/
│   │   ├── dependencyInyection.ts # DI Container
│   │   ├── verifyJWT.ts
│   │   └── verifyRole.ts
│   │
│   ├── user/                      # Módulo de usuarios
│   │   ├── DTOs/
│   │   │   └── userDTO.ts
│   │   ├── entities/
│   │   │   └── userEntity.ts
│   │   ├── models/
│   │   │   └── userModel.ts
│   │   ├── repositories/
│   │   │   └── UserRepository.ts
│   │   ├── validations/
│   │   │   └── user.validation.ts
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   │
│   └── index.ts                   # Punto de entrada
│
├── .env                           # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/CrisDeCrisis/tlp4-tp_formotex-gonzalez_cristian.git
cd tlp4-tp_formotex-gonzalez_cristian
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env
```

4. Configurar base de datos en el archivo `.env`

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/equipment-management
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=7d
SUPER_ADMIN_NAME=Admin
SUPER_ADMIN_EMAIL=admin@sistema.com
SUPER_ADMIN_PASSWORD=Admin123
```

## 💻 Uso

### Modo Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado en `.env`).

### Seed de Base de Datos

Poblar la base de datos con datos de prueba:

```bash
npm run seed
```

Esto creará:

- 1 Super Admin
- 2 Admins
- 3 Usuarios regulares
- Varios equipos de prueba

### Compilar para Producción

```bash
npm run build
npm start
```

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint            | Descripción      | Acceso      |
| ------ | ------------------- | ---------------- | ----------- |
| POST   | `/api/auth/login`   | Iniciar sesión   | Público     |
| GET    | `/api/auth/session` | Verificar sesión | Autenticado |
| GET    | `/api/auth/logout`  | Cerrar sesión    | Autenticado |

### Usuarios

| Método | Endpoint                    | Descripción                    | Acceso        |
| ------ | --------------------------- | ------------------------------ | ------------- |
| POST   | `/api/users`                | Crear usuario                  | Admin         |
| GET    | `/api/users`                | Listar usuarios                | Admin         |
| GET    | `/api/users/profile`        | Perfil del usuario autenticado | Autenticado   |
| GET    | `/api/users/:id`            | Obtener usuario por ID         | Admin u Owner |
| PUT    | `/api/users/:id`            | Actualizar usuario             | Admin u Owner |
| DELETE | `/api/users/:id`            | Eliminar usuario               | Admin         |
| PATCH  | `/api/users/:id/activate`   | Activar usuario                | Admin         |
| PATCH  | `/api/users/:id/deactivate` | Desactivar usuario             | Admin         |
| PATCH  | `/api/users/:id/promote`    | Promover a Admin               | Super Admin   |

### Equipos

| Método | Endpoint                            | Descripción              | Acceso      |
| ------ | ----------------------------------- | ------------------------ | ----------- |
| POST   | `/api/equipments`                   | Crear equipo             | Admin       |
| POST   | `/api/equipments/assign`            | Asignar equipo a usuario | Admin       |
| GET    | `/api/equipments`                   | Listar todos los equipos | Admin       |
| GET    | `/api/equipments/my-equipments`     | Equipos del usuario      | Autenticado |
| GET    | `/api/equipments/my-equipments/:id` | Detalle de mi equipo     | Autenticado |
| GET    | `/api/equipments/status/:status`    | Filtrar por estado       | Admin       |
| GET    | `/api/equipments/type/:type`        | Filtrar por tipo         | Admin       |
| GET    | `/api/equipments/:id`               | Obtener equipo por ID    | Admin       |
| PUT    | `/api/equipments/:id`               | Actualizar equipo        | Admin       |
| PATCH  | `/api/equipments/:id/status`        | Cambiar estado           | Admin       |
| PATCH  | `/api/equipments/:id/return`        | Devolver equipo          | Admin       |
| DELETE | `/api/equipments/:id`               | Eliminar equipo          | Admin       |

## 👥 Sistema de Roles

El sistema implementa tres niveles de acceso:

### 1. USER (Usuario Regular)

- Ver sus propios equipos asignados
- Ver su propio perfil
- Actualizar su propio perfil

### 2. ADMIN (Administrador)

- Todos los permisos de USER
- Crear, editar y eliminar usuarios
- Gestión completa de equipos
- Asignar y desasignar equipos
- Activar/desactivar usuarios

### 3. SUPER_ADMIN (Super Administrador)

- Todos los permisos de ADMIN
- Promover usuarios regulares a administradores
- Gestión total del sistema

### Implementación de Middlewares

```typescript
// verifyJWT.ts - Verifica token válido
class VerifyJWT {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = JWT.verifyToken(token);
    req.user = decoded;
    next();
  }
}

// verifyRole.ts - Verifica permisos
class VerifyRole {
  static isAdmin(req: Request, res: Response, next: NextFunction) {
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role !== UserRole.SUPER_ADMIN
    ) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  }

  static isAdminOrOwner(req: Request, res: Response, next: NextFunction) {
    const isAdmin =
      req.user.role === UserRole.ADMIN ||
      req.user.role === UserRole.SUPER_ADMIN;
    const isOwner = req.params.id === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  }
}
```

## ✅ Validaciones

El sistema utiliza **express-validator** con códigos HTTP apropiados:

### Tipos de Validaciones

#### 1. Validaciones de Entrada (400 Bad Request)

```typescript
// user.validation.ts
export const createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),

  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];
```

#### 2. Validaciones de Parámetros

```typescript
// equipment.validation.ts
export const getEquipmentByIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID es obligatorio")
    .isMongoId()
    .withMessage("El ID debe ser un ObjectId válido"),
];
```

#### 3. Validaciones de Negocio (Service Layer)

```typescript
// user.service.ts
async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
  const existingUser = await this.userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new Error("El email ya está registrado"); // 400 Bad Request
  }
  // ...
}
```

### Códigos HTTP Utilizados

| Código | Uso                | Ejemplo                           |
| ------ | ------------------ | --------------------------------- |
| 200    | Éxito en operación | GET exitoso                       |
| 201    | Recurso creado     | POST exitoso                      |
| 400    | Datos inválidos    | Validación fallida                |
| 401    | No autenticado     | Token no proporcionado o inválido |
| 403    | Sin permisos       | Usuario sin rol adecuado          |
| 404    | No encontrado      | Recurso no existe                 |
| 500    | Error del servidor | Error inesperado                  |

### Middleware de Validación

```typescript
// handleValidationErrors.ts
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};
```

### Uso en Rutas

```typescript
userRouter.post(
  "/",
  VerifyJWT.verifyToken, // 401 si no autenticado
  VerifyRole.isAdmin, // 403 si no es admin
  createUserValidation, // Validaciones
  handleValidationErrors, // 400 si validación falla
  userController.createUser // Lógica del controlador
);
```

## 🧪 Testing

El proyecto incluye ejemplos de testing en `src/testing/`:

```bash
npm run test
```

## 📝 Ejemplo de Flujo Completo

### 1. Inicialización de Dependencias

```typescript
// index.ts
initializeDependencies(); // Crea todas las instancias
```

### 2. Solicitud HTTP

```
POST /api/equipments/assign
Authorization: Bearer <token>
Body: { equipmentId: "...", userId: "..." }
```

### 3. Middleware Chain

```
verifyJWT → verifyRole.isAdmin → assignEquipmentValidation → handleValidationErrors
```

### 4. Controller

```typescript
equipmentController.assignEquipment(req, res);
```

### 5. Service

```typescript
equipmentService.assignEquipment(equipmentId, userId)
  → notify observers (cambio de estado)
```

### 6. Observers

```typescript
AdminNotifierObserver.update(); // Imprime notificación
HistoryLoggerObserver.update(); // Guarda log
```

### 7. Response

```json
{
  "success": true,
  "message": "Equipo asignado exitosamente",
  "data": { ... }
}
```

## 📄 Licencia

ISC

## 👨‍💻 Autor

Cristian González

---

**Nota**: Este proyecto fue desarrollado como trabajo práctico para demostrar la aplicación de patrones de diseño y principios SOLID en un sistema backend real.
