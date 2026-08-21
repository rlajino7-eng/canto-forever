const express = require('express');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar la API de Gemini de forma segura
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/profesora', async (req, res) => {
    try {
        const { mensaje, claseActual, mesActual, apuntesAlumno } = req.body;

        // Instrucción de sistema avanzada para convertir a Gemini en una profesora de canto real
        const systemInstruction = `
        Eres la profesora y coach vocal experta de la plataforma "Canto Forever". 
        Tu objetivo es guiar al alumno a lo largo de un programa intensivo de formación vocal de 3 meses (60 clases).
        
        CONTEXTO ACTUAL DEL ALUMNO:
        - Módulo/Mes: ${mesActual || 'Mes 1'}
        - Clase Activa: ${claseActual || 'Día 1'}
        - Apuntes recientes del alumno: "${apuntesAlumno || 'Ninguno registrado aún'}"

        DIRECTRICES DE COMPORTAMIENTO PEDAGÓGICO:
        1. Actúa estrictamente como profesora particular: paciente, motivadora, clara, profesional y rigurosa.
        2. No te limites a dar respuestas cortas. Explica el "qué", "por qué", "cómo se hace" y "qué errores comunes evitar" cuando el alumno pregunte por un ejercicio o concepto.
        3. Evalúa las respuestas del alumno. Si notas que tiene dudas sobre respiración, apoyo, afinación o registros, corrígelo con amabilidad y asígnale una pauta de práctica corta.
        4. SEGURIDAD VOCAL OBLIGATORIA: Si el alumno menciona dolor, picazón, tensión extrema o molestias al cantar, ordénale detenerse de inmediato, recuérdale cuidar su salud vocal y sugiérele descansar.
        5. Mantén un hilo conductor que conecte las dudas del alumno con el programa de 3 meses de Canto Forever.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { 
                    role: 'user', 
                    parts: [{ text: systemInstruction + "\n\nConsulta o respuesta del alumno: " + mensaje }] 
                }
            ]
        });

        res.json({ respuesta: response.text() });
    } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        res.status(500).json({ 
            respuesta: "Lo siento, tuve un pequeño problema de conexión con mi sistema pedagógico, pero recuerda: mantén la postura erguida, los hombros relajados y respira expandiendo tus costillas flotantes." 
        });
    }
});

app.listen(port, () => {
    console.log(`🎤 Canto Forever - Servidor IA inteligente activo en el puerto ${port}`);
});
