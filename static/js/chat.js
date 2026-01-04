// === PEGAR ELEMENTOS DO HTML ===
const input = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const messagesBox = document.getElementById("messages");
const typingIndicator = document.getElementById("typingIndicator");
const chatHeader = document.getElementById("chatHeader");


// === CONVERSAS (pode editar como quiser) ===
let conversations = {
    lucas: [
        { from: "received", text: "Olá! Tudo bem?", time: "14:20" },
        { from: "sent", text: "Tudo bem, sim!", time: "14:21" }
    ],
    joao: [
        { from: "received", text: "Boa tarde, aluno!", time: "12:00" }
    ],
    maria: [
        { from: "received", text: "Você viu o trabalho novo?", time: "09:45" }
    ]
};


// === CONTATO ATUAL ===
let currentChat = "lucas";


// MOSTRAR AS MENSAGENS NA TELA// 
function loadConversation(user) {
    currentChat = user;

    // Atualiza o nome no topo
    chatHeader.textContent =
        document.querySelector(`li[data-user="${user}"]`).textContent;

    // Limpa mensagens atuais
    messagesBox.innerHTML = "";

    // Adiciona as mensagens da conversa
    conversations[user].forEach(msg => {
        const message = document.createElement("div");
        message.classList.add("msg", msg.from);
        message.innerHTML = `
            <span>${msg.text}</span>
            <small class="msg-time">${msg.time}</small>
        `;
        messagesBox.appendChild(message);
    });

    messagesBox.scrollTop = messagesBox.scrollHeight;
}


// ENVIAR MENSAGEM// 
function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    // Hora atual
    const now = new Date();
    const time =
        now.getHours().toString().padStart(2, "0") + ":" +
        now.getMinutes().toString().padStart(2, "0");

    // Criar elemento HTML
    const msg = document.createElement("div");
    msg.classList.add("msg", "sent");
    msg.innerHTML = `
        <span>${text}</span>
        <small class="msg-time">${time}</small>
    `;

    messagesBox.appendChild(msg);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Salvar na conversa atual
    conversations[currentChat].push({
        from: "sent",
        text,
        time
    });

    input.value = "";
}


//  INDICADOR DE "DIGITANDO//
let typingTimeout;

input.addEventListener("input", () => {
    const contactName = chatHeader.textContent;

    typingIndicator.textContent = `${contactName} está digitando...`;
    typingIndicator.style.display = "block"; 

    

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
        typingIndicator.style.display = "none";
    }, 900);
});



// EVENTOS DE ENVIO//
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});


// TROCAR ENTRE CONTATOS// 
document.querySelectorAll(".contacts li").forEach(li => {
    li.addEventListener("click", () => {
        loadConversation(li.dataset.user);
    });
});


//  CARREGAR A PRIMEIRA CONVERSA AO ABRIR O SITE// 
loadConversation(currentChat);