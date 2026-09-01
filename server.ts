import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily or safely with User-Agent header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API: JSONBin Backup
app.post('/api/backup/save', async (req: Request, res: Response) => {
  const { API_KEY, BIN_ID } = process.env;
  if (!API_KEY || !BIN_ID) return res.status(500).json({ error: 'Configuración de respaldo no encontrada' });

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) throw new Error('Error al guardar en JSONBin');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al realizar el respaldo' });
  }
});

// API: JSONBin Load
app.get('/api/backup/load', async (req: Request, res: Response) => {
  const { API_KEY, BIN_ID } = process.env;
  if (!API_KEY || !BIN_ID) return res.status(500).json({ error: 'Configuración de respaldo no encontrada' });

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY },
    });
    if (!response.ok) throw new Error('Error al cargar desde JSONBin');
    const data = await response.json();
    res.json(data.record);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el respaldo' });
  }
});

// API: Enrich book data with Dewey Decimal, Topographic signature, Category & Description
app.post('/api/gemini/enrich-book', async (req: Request, res: Response) => {
  try {
    const { title, author, isbn } = req.body;
    if (!title && !isbn) {
      return res.status(400).json({ error: 'Se requiere al menos el título o ISBN del libro.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Servicio de IA no disponible (API Key no configurada).',
        fallback: true,
      });
    }

    const prompt = `Analiza este libro para un sistema de biblioteca física:
Título: ${title || 'Desconocido'}
Autor: ${author || 'Desconocido'}
ISBN: ${isbn || 'Desconocido'}

Devuelve información bibliográfica precisa en español, incluyendo clasificación decimal Dewey, signatura topográfica de tejuelo (ej: 863.64 / MAR / c.1), género/categoría, año estimado de publicación, editorial destacada, sugerencia de ubicación en estantería (ej: Sala A - Estante 3 - Fila B), y un resumen conciso de 2-3 frases para la ficha de préstamo.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Eres un bibliotecario profesional y catalogador experto en el Sistema de Clasificación Decimal de Dewey (CDU/DDC) y normas de catalogación bibliotecaria en español.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Título oficial completo corregido' },
            author: { type: Type.STRING, description: 'Nombre completo del autor/es' },
            isbn: { type: Type.STRING, description: 'ISBN normalizado (ISBN-10 o ISBN-13)' },
            category: { type: Type.STRING, description: 'Categoría principal (ej: Literatura Hispanoamericana, Ciencias Exactas, Historia Universal, etc.)' },
            deweyCode: { type: Type.STRING, description: 'Código de Clasificación Dewey (ej: 863.64, 530.1, 940.53)' },
            topographicSignature: { type: Type.STRING, description: 'Signatura topográfica para tejuelo de lomo (ej: 863.64 / GAR / cien)' },
            publisher: { type: Type.STRING, description: 'Editorial representativa o reconocida' },
            publishYear: { type: Type.INTEGER, description: 'Año de primera publicación o edición relevante' },
            suggestedShelf: { type: Type.STRING, description: 'Sugerencia de estante físico (ej: Estante 4 - Balda 2)' },
            summary: { type: Type.STRING, description: 'Sinopsis o resumen conciso del libro en español' },
            pageCount: { type: Type.INTEGER, description: 'Número aproximado de páginas' },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Palabras clave y materias temáticas'
            }
          },
          required: ['title', 'author', 'category', 'deweyCode', 'topographicSignature', 'summary']
        }
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: 'No se generó respuesta del modelo de IA.' });
    }

    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error en /api/gemini/enrich-book:', error);
    return res.status(500).json({
      error: error?.message || 'Error al enriquecer información del libro.',
    });
  }
});

// API: Library AI Assistant (Preguntas a la IA sobre gestión, clasificaciones, recomendaciones)
app.post('/api/gemini/library-assistant', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Pregunta requerida' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Servicio de IA no disponible (API Key no configurada).',
      });
    }

    const prompt = `Pregunta del bibliotecario/usuario: "${question}"
Contexto de la biblioteca: ${JSON.stringify(context || {})}
Responde de forma clara, útil y profesional en español. Si piden recomendaciones de libros o cómo organizar una sección, da ejemplos concretos y códigos Dewey útiles.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Eres BiblioBot, el asistente inteligente y experto bibliotecario de la aplicación BiblioTech. Ayudas a catalogar libros, clasificar según Dewey, organizar estantes físicos, resolver dudas de préstamos y asesorar a los lectores con un tono amable y profesional.',
      }
    });

    return res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error('Error en /api/gemini/library-assistant:', error);
    return res.status(500).json({
      error: error?.message || 'Error en el asistente de biblioteca.',
    });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BiblioTech Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
