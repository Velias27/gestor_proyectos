# Gestor de Proyectos
Gestor de Proyectos es una aplicación web para la gestión de proyectos y tareas, diseñada para facilitar la organización y el seguimiento de proyectos colaborativos en entornos académicos o empresariales. La plataforma permite a los usuarios autenticados gestionar proyectos, tareas y equipos de trabajo de forma intuitiva y funcional.

## Link Video
https://youtu.be/WoJJoljAIPo

## Integrantes y avance
Con el proyecto se logró un 90% de avance: 
- Victor Amilcar Elías Peña                EP171613
- Melissa Vanina López Peña                LP223029
- Oscar Alexander Quintanilla Rodriguez    QR200363
- David Ernesto Ramos Vásquez              RV230544
- Oscar Dave Guerra Pacheco                GP200006

## Enlace Vercel
https://gestor-proyectos-lyart.vercel.app/login

## Credenciales de prueba
El script de seed (prisma/seed.js) crea los siguientes usuarios de prueba:
- Administrador (ADMIN)
> Email: admin@example.com
> Contraseña: adminPassword

- Gerente de proyectos (PROJECT_MANAGER)
> Email: pm@example.com
> Contraseña: pmPassword

-Miembro del equipo (TEAM_MEMBER)
> Email: team@example.com
> Contraseña: teamPassword


## Descripción
Gestor de Proyectos es un sistema integral que utiliza Next.js y React para el frontend, Prisma y MySQL para la persistencia de datos, y Tailwind CSS para un diseño moderno. La aplicación implementa autenticación mediante JWT y controla el acceso a funcionalidades específicas según el rol del usuario. Los roles definidos son:

- Administrador (ADMIN):
  
> 1. Gestiona usuarios (crear, editar, eliminar).

> 2. Configura permisos y roles.

> 3. Supervisa el estado general del sistema.

- Gerente de Proyectos (PROJECT_MANAGER):

> 1. Crea y administra proyectos.

> 2. Asigna tareas a miembros del equipo.

> 3. Supervisa el progreso y genera reportes.

- Miembro del Equipo (TEAM_MEMBER):
  
> 1. Accede a los proyectos y tareas asignadas.

> 2. Actualiza el estado de las tareas y colabora con el equipo.

La aplicación cuenta con rutas protegidas que verifican el token JWT y redirigen al usuario al dashboard correspondiente según su rol. Además, incorpora una arquitectura modular y un diseño atractivo y funcional, lo que facilita su mantenimiento y escalabilidad.

## Características Principales

- Autenticación y Seguridad:  
> 1. Inicio de sesión mediante email y contraseña.
> 2. Generación y verificación de tokens JWT.
> 3. Almacenamiento del token en localStorage (o sessionStorage, de forma consistente) y redirección si no se encuentra o es inválido.
> 4. Middleware y funciones helper que controlan el acceso a rutas protegidas y validan el rol del usuario.

- Gestión de Usuarios (ADMIN):
> 1. CRUD completo de usuarios.
> 2. Visualización de una tabla con la lista de usuarios.
> 3. Modal para agregar y editar usuarios (con campos: nombre, email, contraseña y rol).
> 4. Control de acceso: solo ADMIN puede gestionar usuarios.

- Gestión de Proyectos (PROJECT_MANAGER):
> 1. Creación, edición y visualización de proyectos.
> 2. Asignación y administración de tareas dentro de los proyectos.
> 3. Visualización de métricas y reportes específicos (proyectos gestionados, tareas asignadas, miembros del equipo).

- Gestión de tareas (TEAM_MEMBER):
> 1. Asociación de tareas a cada proyecto.
> 2. Actualización del estado de las tareas.
> 3. Interfaz intuitiva para el seguimiento del progreso.

- Interfaz de usuario y diseño:
> 1. Uso de Tailwind CSS para un diseño limpio y estético.
> 2. Sidebar con navegación que incluye enlaces para acceder a Dashboard según el rol del usuario autenticado y Logout.
> 3. Header y Footer integrados en el Layout para mantener la consistencia visual.

- Integración con API REST:
> 1. Comunicación entre el frontend y el backend mediante Axios.
> 2. Rutas de la API para usuarios, proyectos y tareas, siguiendo los estándares REST.

# Tecnologías Utilizadas
- Frontend:
> 1. Next.js (React)
> 2. Tailwind CSS
> 3. Lucide-react (para íconos)

- Backend:
> 1. Node.js
> 2. Prisma ORM
> 3. MySQL

- Autenticación y Seguridad:
> 1. JWT (JSON Web Token)
> 2. bcryptjs

- Herramientas de Despliegue
> 1. Vercel
  
## Estructura del Proyecto 
La organización del proyecto sigue una estructura modular:

```bash
GESTOR_PROYECTOS/
├── prisma/
│   ├── schema.prisma              # Definición de modelos (User, Project, Task, Status, Role)
│   └── seed.js                    # Script para poblar la base de datos con datos de prueba
├── lib/
│   ├── prisma.js                  # Configuración del cliente Prisma
│   └── auth.js                    # Funciones helper para autenticación (verificación JWT, etc.)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.js          # Layout principal (Sidebar, Header, Footer)
│   │   │   ├── Sidebar.js         # Barra lateral (Dashboard, opción de navegación según usuario, Logout)
│   │   │   ├── Header.js          # Encabezado (título, logout)
│   │   │   └── Footer.js          # Pie de página
│   │   └── UserModal.js           # Modal para agregar/editar usuarios
│   ├── pages/
│   │   ├── api/                   # Endpoints de la API
│   │   │   ├── login.js           # Endpoint para iniciar sesión
│   │   │   ├── projects/
│   │   │   │   ├── [projectId].js # Endpoint para obtener, actualizar o eliminar proyectos
│   │   │   │   ├── assigned.js    # Obtener proyectos asignados
│   │   │   │   └── tasks.js       # Crear tareas de un proyecto
│   │   │   ├── tasks/
│   │   │   │   ├── [id].js        # Endpoint para obtener o actualizar tarea
│   │   │   │   ├── updateTask.js  # Lógica de actualización del estado de tareas 
│   │   │   │   └── userApiTask.js # Endpoint obtener proyecto con tareas asignadas
│   │   │   ├── tasks.js           # Endpoint para crear tarea
│   │   │   ├── team-members.js    # Endpoint para obtener usuarios
│   │   │   ├── users/
│   │   │   │   └── [id].js        # Endpoint para usuario específico (actualizar/eliminar)
│   │   │   ├── users.js           # Endpoint para crear usuarios
│   │   │   └── ...
│   │   ├── dashboard/             # Directorio para dashboards
│   │   │   ├── admin.js           # Dashboard de administrador
│   │   │   ├── pm.js              # Dashboard de Project Manager
│   │   │   └── team.js            # Dashboard de Team Member
│   │   ├── projects/
│   │   │   ├── index.js           # Lista de proyectos
│   │   │   ├── [id].js            # Editar un proyecto
│   │   │   └── new.js             # Crear proyecto nuevo
│   │   ├── tasks/
│   │   │   └── [id].js            # Detalle/edición de una tarea específica
│   │   ├── users/                 # Carpeta de vistas para gestión de usuarios
│   │   │   ├── index.js           # Lista de usuarios (tabla, modal)
│   │   │   └── [id].js            # Página de detalle/edición de un usuario específico
│   │   ├── _app.js                # Punto de entrada de la aplicación (Next.js)
│   │   ├── _document.js           # Documento HTML personalizado (Next.js)
│   │   ├── dashboard.js           # Ruta de dashboard genérico (redirige según rol)
│   │   ├── index.js               # Página de redirección inicial (login o dashboard)
│   │   └── login.js               # Página de inicio de sesión
├── styles/
│   └── globals.css                # Estilos globales (Tailwind + personalizaciones)
├── .env                           # Variables de entorno (DATABASE_URL, JWT_SECRET)
├── package.json                   # Dependencias, scripts
├── tailwind.config.js             # Configuración de Tailwind
└── README.md                      # Documentación del proyecto
```
## Lógica de Login y Roles
- Inicio de Sesión (login):
> 1. El usuario ingresa su email y contraseña
> 2. El sistema verifica las credenciales en la base de datos (utilizando bcryptjs para comparar la contraseña encriptada).
> 3. Si las credenciales son correctas, se genera un token JWT que incluye la información del usuario (userId, email, role).
> 4. El usuario es redirigido a /dashboard, donde se le muestra el dashboard correspondiente a su rol (ADMIN, PROJECT_MANAGER o TEAM_MEMBER).

- Verificación de Roles y Protección de Rutas:
> 1. Cada vez que el usuario navega a una ruta protegida, el sistema decodifica el token para obtener el rol.
> 2. Si el rol no coincide con la ruta solicitada (por ejemplo, un TEAM_MEMBER intentando acceder a la vista de ADMIN), se redirige al dashboard principal o se muestra un mensaje de acceso denegado.
> 3. Para la gestión de usuarios, solo el ADMIN tiene acceso. Para la gestión de proyectos, solo el PROJECT_MANAGER puede crear y asignar proyectos, los TEAM_MEMBERS pueden ver sus tareas.

## Instalación y Configuración
1. Clonar el repositorio
```bash
git clone https://github.com/Velias27/gestor_proyectos.git
cd GESTOR_PROYECTOS
```
2. Instalar dependencias
```bash
 npm install
```
3. Configurar variables de entorno
Crear un archivo .env en la raíz del proyecto con las siguientes variables (ajustadas a tu entorno)
```bash
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/gestor_proyectos"
JWT_SECRET="tuClaveSecreta"
```
4. Generar cliente de Prisma
```bash
npx prisma generate
```
5. Aplicar migraciones a la base de datos
```bash
npx prisma migrate dev --name init
```
6. Ejecutar script de seed
```bash
npm run seed
```
7. Iniciar el servidor de desarrollo
```
npm run dev
```




