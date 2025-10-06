// Usamos el SDK de OpenAI v4 que es el más reciente
import OpenAI from 'openai';

// Inicializamos el cliente de OpenAI.
// La API Key se lee automáticamente desde las variables de entorno (process.env.OPENAI_API_KEY)
const openai = new OpenAI();

// Esta es la función serverless que Vercel ejecutará.
export default async function handler(request, response) {
    // Solo permitimos peticiones POST
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'método no permitido' });
    }

    try {
        const { text, tone } = request.body;

        if (!text || text.trim() === '') {
            return response.status(400).json({ error: 'el texto es requerido' });
        }
        
        const systemPrompt = `eres un experto en comunicación y redacción de correos. tu tarea es reescribir un texto para que suene ${tone}, cordial y profesional. mantén el objetivo principal del mensaje. la respuesta debe ser únicamente el texto reescrito.`;
        
        const userPrompt = `texto original: "${text}"`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 256,
        });
        
        const result = completion.choices[0].message.content.trim();

        return response.status(200).json({ result });

    } catch (error) {
        console.error("error en la llamada a openai:", error);
        return response.status(500).json({ error: 'error al contactar al servicio de ia' });
    }
}