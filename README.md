# 🎥 EduIA: Plataforma de Creación de Videos Educativos con AI

**EduIA** es una plataforma diseñada para automatizar la creación de videos educativos de alta calidad, con un enfoque especial en temas de ingeniería y contenido técnico. Utiliza modelos de Inteligencia Artificial para generar guiones, locuciones y visualizaciones dinámicas de datos, integrando todo en un flujo de renderizado profesional mediante Remotion.

---

## 🚀 Vision General

El sistema toma un **tema (Topic)** como entrada y realiza las siguientes tareas:

1.  **Generación de Guión:** Utiliza Google Gemini para crear un guión estructurado (Introducción, Explicación, Ejemplo con Datos y Conclusión).
2.  **Locución (TTS):** Transforma cada sección del guión en audio de alta fidelidad.
3.  **Visualización de Datos:** Si el guión incluye datos técnicos, genera gráficas dinámicas (barras, líneas) automáticamente usando Recharts.
4.  **Composición de Video:** Orquesta un proyecto de Remotion que sincroniza el audio, el texto y las gráficas en un archivo MP4 final.

---

## 🛠️ Stack Tecnológico

### Backend (Python/FastAPI)

- **FastAPI:** Framework principal para el backend y la orquestación.
- **Google Gemini SDK:** Para la generación inteligente de contenido y estructuración de datos.
- **Edge-TTS / Google Cloud TTS:** Para la generación de voces.
- **Pydantic:** Validación de esquemas de datos.

### Video Engine (React/Remotion)

- **Remotion:** Motor de video programático basado en React.
- **Recharts:** Para la creación de gráficas animadas dentro del video.
- **Express.js:** Servidor dedicado para el renderizado de los videos.

---

## 📁 Estructura del Proyecto

```bash
EduIA/
├── app/                # Backend en Python (FastAPI)
│   ├── routes/         # Endpoints de la API
│   ├── services/       # Lógica de negocio (Gemini, TTS, Orquestación)
│   ├── models/         # Esquemas de datos (Pydantic)
│   └── output/         # Almacenamiento temporal de audios
├── remotion/           # Motor de video (React + Remotion)
│   ├── src/            # Plantillas de video y componentes React
│   ├── server/         # Servidor de renderizado (Node.js)
│   └── public/         # Assets estáticos
├── outputs/            # Videos finales generados (.mp4)
└── .env                # Variables de entorno (API Keys)
```

---

## ⚙️ Instalación y Configuración

### 1. Requisitos Previos

- Python 3.10+
- Node.js 18+
- Una API Key de Google Gemini (Google AI Studio).

### 2. Configuración del Backend

```bash
cd app
pip install -r requirements.txt
# Crea un archivo .env con:
# GEMINI_API_KEY=tu_api_key
# REMOTION_SERVER_URL=http://localhost:3001
```

### 3. Configuración de Remotion

```bash
cd remotion
npm install
```

---

## 🏃 Cómo Ejecutarlo

Para que el sistema funcione, ambos servidores (Backend y Video Engine) deben estar activos.

1. **Iniciar el servidor de renderizado de Remotion:**

   ```bash
   cd remotion
   npm run server
   ```

2. **Iniciar el Backend de FastAPI:**

   ```bash
   cd app
   uvicorn main:app --reload
   ```

3. **Generar un video:**
   Envía una petición POST a `http://localhost:8000/video/generate-script`:

   ```json
   {
     "topic": "Leyes de Kirchhoff en Circuitos Eléctricos"
   }
   ```

---

## 🚧 Estado del Proyecto (WIP)

Este proyecto se encuentra en una fase inicial de desarrollo. Próximamente se añadirán:

- [ ] **Interfaz de Usuario (Frontend):** Una web para que el docente pueda previsualizar y editar el guión antes de renderizar.
- [ ] **Plantillas Personalizables:** Selección de diferentes estilos visuales y paletas de colores.
- [ ] **Integración de Imágenes/Video de Stock:** Uso de APIs como Pexels para añadir clips de video relevantes.
- [ ] **Multi-voz:** Opción para elegir diferentes locutores y acentos.
