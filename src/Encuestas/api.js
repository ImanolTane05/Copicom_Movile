import { API_BASE_URL } from '../utils/constants'; 
import { MOCK_ENCUESTAS, getMockEncuestaById } from '../utils/mockData';

//OBTENER LISTA DE ENCUESTAS ACTIVAS 
export const fetchEncuestasActivas = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/encuestas`); 
        if (!response.ok) {
            throw new Error(`Error ${response.status} al conectar.`);
        }
        let data = await response.json();
        if (data.encuestas && Array.isArray(data.encuestas)) {
            data = data.encuestas; 
        } 
        return Array.isArray(data) ? data : []; 
    } catch (error) {
        console.warn("fallo desde el back", error.message);
        return MOCK_ENCUESTAS; 
    }
};

// OBTENER DETALLE DE ENCUESTA POR ID
export const fetchEncuestaById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/encuestas/${id}`); 
        if (!response.ok) {
            let errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Error ${response.status} al obtener encuesta.`);
        }
        return await response.json();
    } catch (error) {
        console.warn(`ADVERTENCIA: Falló la conexión para encuesta ${id}. Usando datos de reserva (MOCK).`, error.message);
        const mockData = getMockEncuestaById(id);
        if (!mockData) {
            throw new Error("Encuesta no encontrada ni en la API ni en los datos de reserva.");
        }
        return mockData;
    }
};

// SUBIR RESPUESTAS
export const submitRespuestas = async (encuestaId, respuestasArray) => { 
    try {
        const bodyPayload = { respuestas: respuestasArray }; 
        
        console.log("Enviando payload al servidor:", JSON.stringify(bodyPayload, null, 2));

        const response = await fetch(`${API_BASE_URL}/encuestas/${encuestaId}/responder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyPayload), 
        });

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                
                throw new Error(`Error ${response.status}: El servidor no devolvió un error legible.`); 
            }
            throw new Error(errorData.error || errorData.mensaje || `Error ${response.status}: Error desconocido del servidor.`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al intentar enviar respuestas al backend:", error);
        throw error;
    }
};