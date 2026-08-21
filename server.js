const express = require('express');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar Gemini de forma segura en el servidor
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Endpoint seguro para conversar con la Profesora IA de Canto Forever
app.api = app.post('/api/profesora', async (req, res) => {
    try {
        const { mensaje, claseActual } = req.body;

        const systemInstruction = `Eres la profesora de la plataforma de entrenamiento vocal "Canto Forever". 
        Tu personalidad es paciente, motivadora, clara, profesional y positiva. 
        Enseñas un programa de 3 meses de técnica vocal. 
        Actualmente el alumno está en la ${claseActual || 'Clase Inicial'}. 
        Si el alumno indica dolor o molestias al cantar, ordénale detenerse de inmediato y recuérdale cuidar su salud vocal. 
        Guía al alumno paso a paso, hazle preguntas y corrige sus errores de forma constructiva.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: systemInstruction + "\n\nMensaje del alumno: " + mensaje }] }
            ]
        });

        res.json({ respuesta: response.text() });
    } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        res.status(500).json({ respuesta: "Lo siento, tuve un pequeño problema técnico procesando tu duda, pero recuerda mantener la postura y respirar desde el diafragma." });
    }
});

app.listen(port, () => {
    console.log(`🎤 Canto Forever corriendo en el puerto ${port}`);
});
