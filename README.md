# The Beast 2 - Launcher de Minecraft

> Launcher creado con Launcher Creator
> 

---

## TABLA DE CONTENIDOS

1. [Requisitos Previos](#1-requisitos-previos)
2. [Instalación Local](#2-instalación-local)
3. [Subir a GitHub](#3-subir-a-github)
4. [Publicar en Vercel](#4-publicar-en-vercel)
5. [Convertir a App de Escritorio (EXE)](#5-convertir-a-app-de-escritorio-exe)
6. [Convertir a App de Android (APK)](#6-convertir-a-app-de-android-apk)
7. [Personalización Adicional](#7-personalización-adicional)
8. [Solución de Problemas](#8-solución-de-problemas)
9. [Soporte](#9-soporte)

---

## 1. REQUISITOS PREVIOS

Antes de comenzar, asegúrate de tener instalado:

### Para desarrollo local:
- **Node.js** (versión 18 o superior)
  - Descarga: https://nodejs.org/
  - Verificar instalación: `node --version`

- **npm** (viene incluido con Node.js)
  - Verificar instalación: `npm --version`

### Para subir a GitHub:
- **Git**
  - Descarga: https://git-scm.com/
  - Verificar instalación: `git --version`

- **Cuenta de GitHub**
  - Crear cuenta: https://github.com/signup

### Para publicar en Vercel:
- **Cuenta de Vercel**
  - Crear cuenta: https://vercel.com/signup
  - Puedes usar tu cuenta de GitHub para registrarte

---

## 2. INSTALACIÓN LOCAL

Sigue estos pasos para ejecutar el launcher en tu computadora:

### Paso 2.1: Extraer el ZIP
1. Localiza el archivo ZIP descargado
2. Haz clic derecho > "Extraer aquí" o "Extraer todo"
3. Abre la carpeta extraída

### Paso 2.2: Abrir Terminal/CMD en la carpeta
**Windows:**
- Abre la carpeta extraída
- Haz clic en la barra de direcciones
- Escribe `cmd` y presiona Enter

**Mac/Linux:**
- Abre Terminal
- Escribe `cd ` (con espacio)
- Arrastra la carpeta al terminal
- Presiona Enter

### Paso 2.3: Instalar dependencias
Ejecuta este comando:

```bash
npm install
```

Espera a que termine (puede tomar 1-3 minutos).

### Paso 2.4: Iniciar el servidor de desarrollo
Ejecuta:

```bash
npm run dev
```

### Paso 2.5: Ver el launcher
1. Abre tu navegador web
2. Ve a: http://localhost:3000
3. ¡Tu launcher debería aparecer!

### Paso 2.6: Detener el servidor
- Presiona `Ctrl + C` en la terminal

---

## 3. SUBIR A GITHUB

Para poder publicar tu launcher en internet, primero debes subirlo a GitHub.

### Paso 3.1: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Escribe un nombre para tu repositorio (ej: "mi-launcher-minecraft")
3. Selecciona "Public" o "Private" según prefieras
4. NO marques ninguna casilla de inicialización
5. Clic en "Create repository"

### Paso 3.2: Configurar Git (solo primera vez)
Si nunca has usado Git, ejecuta estos comandos:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 3.3: Inicializar y subir
Ejecuta estos comandos uno por uno:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Mi launcher de Minecraft"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

**IMPORTANTE:** Reemplaza `TU_USUARIO` con tu usuario de GitHub y `TU_REPOSITORIO` con el nombre de tu repositorio.

```bash
git push -u origin main
```

Te pedirá tus credenciales de GitHub. Introdúcelas.

### Paso 3.4: Verificar
1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos del launcher

---

## 4. PUBLICAR EN VERCEL

Vercel es un servicio gratuito que hospedará tu launcher en internet.

### Paso 4.1: Conectar con GitHub
1. Ve a https://vercel.com
2. Haz clic en "Sign Up" o "Login"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel para acceder a tu GitHub

### Paso 4.2: Importar proyecto
1. Haz clic en "Add New..." > "Project"
2. Busca tu repositorio del launcher
3. Haz clic en "Import"

### Paso 4.3: Configurar (opcional)
- **Project Name:** Nombre de tu proyecto (afecta la URL)
- **Framework Preset:** Debería detectar "Next.js" automáticamente
- No necesitas cambiar nada más

### Paso 4.4: Deploy
1. Haz clic en "Deploy"
2. Espera 1-3 minutos
3. ¡Listo! Tendrás una URL como: https://tu-launcher.vercel.app

### Paso 4.5: Personalizar dominio (opcional)
1. Ve a la configuración de tu proyecto en Vercel
2. Sección "Domains"
3. Puedes agregar un dominio personalizado si tienes uno

---

## 5. CONVERTIR A APP DE ESCRITORIO (EXE)

Para convertir tu launcher web en una aplicación de Windows (.exe):

### OPCIÓN RECOMENDADA: Usar el conversor online

1. Primero, publica tu launcher en Vercel (sección anterior)
2. Copia la URL de tu launcher (ej: https://tu-launcher.vercel.app)
3. Ve a: **https://v0-web-to-apk-exe.vercel.app**
4. Selecciona "Windows/PC"
5. Pega la URL de tu launcher
6. Configura el nombre e icono
7. Descarga tu archivo .exe

### OPCIÓN AVANZADA: Usando Electron manualmente

Si prefieres hacerlo tú mismo:

1. Clona el proyecto de Electron wrapper
2. Configura la URL de tu launcher
3. Ejecuta el build

Esto requiere conocimientos técnicos avanzados.

---

## 6. CONVERTIR A APP DE ANDROID (APK)

Para convertir tu launcher web en una aplicación de Android (.apk):

### OPCIÓN RECOMENDADA: Usar el conversor online

1. Primero, publica tu launcher en Vercel (sección 4)
2. Copia la URL de tu launcher
3. Ve a: **https://v0-web-to-apk-exe.vercel.app**
4. Selecciona "Android"
5. Pega la URL de tu launcher
6. Configura:
   - Nombre de la app
   - Nombre del paquete (ej: com.miservidor.launcher)
   - Icono de la app
   - Orientación (horizontal recomendado para Minecraft)
7. Descarga tu archivo .apk

### Instalar el APK:

1. Pasa el archivo .apk a tu teléfono Android
2. Abre el archivo
3. Si te pide permisos, ve a Ajustes > Seguridad > "Instalar apps desconocidas"
4. Permite la instalación desde la fuente correspondiente
5. Instala la app

---

## 7. PERSONALIZACIÓN ADICIONAL

### Cambiar colores y estilos
Edita el archivo `app/globals.css`

### Cambiar la configuración del launcher
Edita el archivo `app/launcher-config.json`

### Cambiar el título de la página
Edita el archivo `app/layout.tsx`

### Agregar más servidores
Edita el array "servers" en `app/launcher-config.json`

---

## 8. SOLUCIÓN DE PROBLEMAS

### Error: "npm: command not found"
- Node.js no está instalado o no está en el PATH
- Reinstala Node.js desde https://nodejs.org/

### Error: "ENOENT: no such file or directory"
- Asegúrate de estar en la carpeta correcta del proyecto
- Verifica que el ZIP se extrajo correctamente

### Error: "Module not found"
- Ejecuta `npm install` de nuevo

### La página aparece en blanco
- Abre la consola del navegador (F12 > Console)
- Busca errores en rojo
- Revisa que el archivo launcher-config.json sea válido

### El botón de jugar no funciona
- El launcher usa el protocolo minecraft:// que solo funciona si Minecraft está instalado
- En algunos navegadores, necesitas permitir el protocolo

### Error al hacer git push
- Verifica tus credenciales de GitHub
- Si usas autenticación de dos factores, necesitas un Personal Access Token
  - Ve a: GitHub > Settings > Developer settings > Personal access tokens
  - Genera un nuevo token y úsalo como contraseña

### El deploy en Vercel falla
- Revisa los logs de error en Vercel
- Asegúrate de que el proyecto funciona localmente primero
- Verifica que todos los archivos fueron subidos a GitHub

---

## 9. SOPORTE

### Comunidad
- Únete a nuestra comunidad de Discord
- Comparte tus launchers con otros usuarios

### Reportar bugs
- Si encuentras un bug, repórtalo en nuestra comunidad

### Créditos
Creado con Launcher Creator


---

¡Gracias por usar Launcher Creator!
