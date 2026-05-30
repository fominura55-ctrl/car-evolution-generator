import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 5173

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set. Set it in a .env file or environment before running the app.')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname))

app.post('/api/generate', async (req, res) => {
  try {
    const { title, length, style, prompt } = req.body
    const userPrompt = prompt?.trim() || `Create a visually rich car evolution video.`
    const videoPrompt = `Generate a car evolution video in Veo 3.1 with the following details:\n\n` +
      `Title: ${title || 'Car Evolution'}\n` +
      `Duration: ${length || '15'} seconds\n` +
      `Style: ${style || 'futuristic documentary'}\n` +
      `Summary: ${userPrompt}`

    const model = genAI.getGenerativeModel({ model: 'models/veo-3.1' })
    const response = await model.generateContent(videoPrompt)

    const candidates = response.response?.candidates || []
    let videoUrl = null
    let textOutput = ''

    if (Array.isArray(candidates) && candidates.length > 0) {
      const content = candidates[0].content?.parts || []
      for (const part of content) {
        if (part.text) {
          textOutput += part.text + '\n'
          // Check if text contains a video URL or reference
          if (!videoUrl && part.text.startsWith('http')) {
            videoUrl = part.text.trim()
          }
        }
      }
    }

    if (!textOutput && response.response?.text) {
      textOutput = response.response.text
    }

    return res.json({
      success: true,
      videoUrl,
      text: textOutput.trim() || null,
      raw: response
    })
  } catch (error) {
    console.error('Generate error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate the video',
      details: error.response?.data || null
    })
  }
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => {
  console.log(`Car Evolution generator running on http://localhost:${port}`)
})
