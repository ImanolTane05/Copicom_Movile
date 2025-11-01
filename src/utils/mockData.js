// --- Modelo de Datos Mock de Encuestas ---

export const MOCK_ENCUESTAS = [
  {
    "_id": "mock_id_1",
    "titulo": "Evaluación del Desempeño Periodístico 2024",
    "descripcion": "Encuesta sobre la calidad del periodismo y la atención en Tlaxcala.",
    "estado": "Activa",
    "fechaPublicacion": new Date('2024-03-15').toISOString(), 
    "preguntas": [
      {
        "_id": "mock_q_1_1",
        "texto": "¿Cómo calificaría la calidad del periodismo local?",
        "tipo": "multiple", // Tipo: Selección de opciones
        "opciones": ["Excelente", "Buena", "Regular", "Deficiente"],
        "obligatoria": true,
        "orden": 1
      },
      {
        "_id": "mock_q_1_2",
        "texto": "¿Qué sugerencias tiene para mejorar el periodismo?",
        "tipo": "abierta", // Tipo: Campo de texto
        "opciones": [],
        "obligatoria": false,
        "orden": 2
      },
    ]
  },
  {
    "_id": "mock_id_2",
    "titulo": "Necesidades de Capacitación Profesional",
    "descripcion": "Ayúdanos a identificar áreas de mejora para futuros talleres y seminarios.",
    "estado": "Activa",
    "fechaPublicacion": new Date('2024-03-12').toISOString(),
    "preguntas": [
      {
        "_id": "mock_q_2_1",
        "texto": "¿Qué temas de capacitación le interesan más?",
        "tipo": "multiple",
        "opciones": ["Manejo de Redes Sociales", "Investigación Digital", "Ética Periodística"],
        "obligatoria": true,
        "orden": 1
      }
    ]
  },
];

// Función para simular la obtención de una encuesta por ID
export const getMockEncuestaById = (id) => {
  return MOCK_ENCUESTAS.find(encuesta => encuesta._id === id);
};

// Se requiere al menos un array vacío de MOCK_NOTICIAS para evitar errores futuros
export const MOCK_NOTICIAS = [];