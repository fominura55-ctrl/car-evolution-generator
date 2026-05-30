const titleInput = document.getElementById('title')
const lengthInput = document.getElementById('length')
const styleInput = document.getElementById('style')
const promptInput = document.getElementById('prompt')
const generateBtn = document.getElementById('generateBtn')
const status = document.getElementById('status')
const result = document.getElementById('result')

const setStatus = (message, isError = false) => {
  status.textContent = message
  status.style.color = isError ? '#ff8f8f' : '#a6b5d2'
}

const showResult = ({ videoUrl, text }) => {
  result.innerHTML = ''
  if (videoUrl) {
    const message = document.createElement('p')
    message.textContent = 'Your video is ready. Open or embed the returned URL below.'
    result.appendChild(message)

    const link = document.createElement('a')
    link.href = videoUrl
    link.target = '_blank'
    link.rel = 'noreferrer noopener'
    link.textContent = videoUrl
    result.appendChild(link)

    const iframe = document.createElement('iframe')
    iframe.src = videoUrl
    iframe.title = 'Generated car evolution video'
    iframe.loading = 'lazy'
    iframe.style.minHeight = '360px'
    result.appendChild(iframe)
  } else {
    const fallback = document.createElement('p')
    fallback.textContent = 'No direct video URL was returned by Veo 3.1. Please check the response text below.'
    result.appendChild(fallback)
  }

  if (text) {
    const textBlock = document.createElement('pre')
    textBlock.textContent = text
    textBlock.style.whiteSpace = 'pre-wrap'
    textBlock.style.marginTop = '18px'
    textBlock.style.background = 'rgba(255,255,255,0.04)'
    textBlock.style.padding = '16px'
    textBlock.style.borderRadius = '14px'
    result.appendChild(textBlock)
  }
}

const handleGenerate = async () => {
  setStatus('Generating video…')
  generateBtn.disabled = true
  result.innerHTML = ''

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titleInput.value,
        length: lengthInput.value,
        style: styleInput.value,
        prompt: promptInput.value
      })
    })

    const body = await response.json()
    if (!response.ok || !body.success) {
      throw new Error(body.error || 'Generation failed')
    }

    setStatus('Generation completed successfully.')
    showResult(body)
  } catch (error) {
    console.error(error)
    setStatus(error.message || 'Unexpected error', true)
  } finally {
    generateBtn.disabled = false
  }
}

generateBtn.addEventListener('click', handleGenerate)
