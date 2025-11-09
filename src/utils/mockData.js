
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
        "tipo": "multiple", 
        "opciones": ["Excelente", "Buena", "Regular", "Deficiente"],
        "obligatoria": true,
        "orden": 1
      },
      {
        "_id": "mock_q_1_2",
        "texto": "¿Qué sugerencias tiene para mejorar el periodismo?",
        "tipo": "abierta", 
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


export const getMockEncuestaById = (id) => {
  return MOCK_ENCUESTAS.find(encuesta => encuesta._id === id);
};

export const MOCK_NOTICIAS = [];