const apiKeyInput = document.getElementById('apiKey')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

4
const perguntarAI = async (question, apiKey) => {
  const model = "gemini-2.0-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const pergunta = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo Stardew Valley

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, dicas, informações sobre personagens, itens.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()} 
    - Faça pesquisas atualizadas sobre a vversão atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda algo que você não tem certeza de que existe na versão atual do jogo.
    ## Resposta
    Economize na resposta, seja direto e responda no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
    ## Exemplo de resposta
    pergunta do usuário: Quando é o aniversário da Robin e o que dar de presente para ela
    resposta: O aniversário da Robin é: **Dia e Estação**/n/n**Itens favoritos:**/n/lista de presentes favoritos/n/n
    pergunta do usuário: Em qual estação plantar milho?
    resposta: A estação para plantar milho é: **Estação**/n/n **Último dia para plantar:**/n/n coloque aqui as últimas datas da estação para plantar milho./n/n
    ---
    Aqui está a pergunta do usuário: ${question}
  `

  const contents = [{
    role: "user",
    parts: [{
      text: pergunta
    }]
  }]

  const tools = [{
    google_search: {}
  }]

  // chamada API
  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

const sendForm = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const question = questionInput.value


  if(apiKey == ''|| question == ''){
    alert('Por favor, preencha todos os campos!')
    return
  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
  // perguntar para a IA
    const text = await perguntarAI(question, apiKey) 
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')
  } catch(error){
    console.log('Erro: ', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = 'Perguntar'
    askButton.classList.remove('loading')
  }
}
form.addEventListener('submit', sendForm)