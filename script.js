const chatbox = document.querySelector(".messages-list");
const chatInput = document.querySelector(".chat-input");
const sendChatBtn = document.querySelector("#send-btn");
const clearChatBtn = document.querySelector("#clear-chat");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

// API configuration
const API_KEY = "AIzaSyCsGeR4LLnZg5x1KFq_rPPAs4f3vNr3VNc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCsGeR4LLnZg5x1KFq_rPPAs4f3vNr3VNc";

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("div");
  chatLi.classList.add("message", className);
  let chatContent = `<div class="message-content"><p>${message}</p></div>`;
  chatLi.innerHTML = chatContent;
  return chatLi; // return chat <li> element
}

const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: "Please respond in Amharic (Ethiopian language). " + userMessage
                }]
            }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format');
        }

        messageElement.textContent = data.candidates[0].content.parts[0].text;
    } catch (error) {
        messageElement.classList.add("error");
        messageElement.textContent = `ስህተት: ${error.message}`;
        console.error('Full error:', error);
    }
}

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("በማሰብ ላይ...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
}

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // Remove the window width check and handle Enter key press
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);

// Add clear chat functionality
clearChatBtn.addEventListener("click", () => {
    // Clear all messages
    chatbox.innerHTML = '';
    // Add back the initial greeting
    chatbox.innerHTML = `
        <div class="message incoming">
            <div class="message-content">
                <p>ሰላም! እንዴት ልረዳዎት እችላለሁ?</p>
            </div>
        </div>
    `;
});

