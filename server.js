const express = require('express');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar Gemini de forma segura
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/profesora', async (req, res) => {
    try {
        const { mensaje, claseActual } = req.body;

        const systemInstruction = `Eres la profesora y coach vocal experta de la plataforma intensiva "Canto Forever". 
        Tu programa abarca 3 meses (60 clases) llevando al alumno desde principiante hasta cantante con base vocal integral (técnica, respiración, postura, registros, resonancia, agudos, interpretación, repertorio, micrófono y teoría musical). 
        Actualmente estás impartiendo la ${claseActual || 'Clase Inicial'}. 
        Responde siempre con rigor pedagógico, explicando el qué, por qué, cómo, errores comunes y ejercicios prácticos. 
        Si el alumno indica dolor o molestias al cantar, ordénale detenerse de inmediato y recuérdale cuidar su salud vocal. 
        Sé paciente, motivadora, clara y profesional.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: systemInstruction + "\n\nConsulta del alumno: " + mensaje }] }
            ]
        });

        res.json({ respuesta: response.text() });
    } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        res.status(500).json({ respuesta: "Lo siento, tuve un pequeño problema técnico procesando tu consulta, pero recuerda mantener la postura y respirar desde el diafragma." });
    }
});

app.listen(port, () => {
    console.log(`🎤 Canto Forever - Programa Intensivo corriendo en el puerto ${port}`);
});
