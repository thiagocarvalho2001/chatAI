import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";


function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY; 
  const genAI = new GoogleGenerativeAI(apiKey);

  async function handleChat(e) {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
      const chat = model.startChat({
        history: chats.map((chat) => ({
          role: chat.role,
          parts: chat.content,
        })), 
        generationConfig: {
          maxOutputTokens: 100,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      setChats([
        ...chats,
        { role: "user", content: message },
        { role: "model", content: text },
      ]);
      setIsTyping(false);
      setMessage("");
    } catch (error) {
      console.error("Erro ao obter resposta da Gemini:", error);
    }
  }

  return (
    <main>
      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Preparando resposta..." : ""}</i>
        </p>
        <form onSubmit={handleChat}>
          <input
            type="text"
            value={message}
            placeholder="Escreva algo"
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.role}`}>
                <span>
                  <b>{chat.role.toUpperCase()}: </b>
                </span>
                {chat.content}
              </div>
            ))
          : ""}
      </section>
      <h1>
        Um CHAT-AI usando a inteligência Gemini do Google. Não faça perguntas
        muito complexas pois ela não vai conseguir responder. Botei a API mais
        simples pois não quero pagar pelas outras que respondem tudo.
      </h1>
    </main>
  );
}

export default App;
