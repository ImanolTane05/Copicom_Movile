import { API_BASE_URL } from '../utils/constants'; 

// 1. Obtiene la lista de noticias (sin el cuerpo completo)
export const fetchNewsList = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/noticias`);
        if (!response.ok) {
            throw new Error(`Error ${response.status} al obtener lista de noticias.`);
        }
        const data = await response.json();
        // El endpoint devuelve un array directo, así que lo devolvemos tal cual.
        return Array.isArray(data) ? data : []; 
    } catch (error) {
        console.error("Error en fetchNewsList:", error);
        // Si falla, se devuelve un array vacío para evitar que la app crashee
        return []; 
    }
};

// 2. Obtiene los detalles de una noticia (incluyendo el cuerpo)
export const fetchNewsDetail = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/noticias/${id}`);
        if (!response.ok) {
            // Manejamos un posible 404 si la noticia no existe
            if (response.status === 404) {
                 throw new Error("La noticia solicitada no fue encontrada.");
            }
            throw new Error(`Error ${response.status} al obtener detalles de la noticia.`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en fetchNewsDetail:", error);
        throw error; // Propagamos el error para mostrarlo en la UI de detalle
    }
};