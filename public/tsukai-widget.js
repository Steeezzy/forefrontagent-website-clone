(function () {
    // Configuration
    const CONFIG = {
        apiEndpoint: document.currentScript.getAttribute('data-api-endpoint') || 'http://localhost:3000/api/chat',
        botId: document.currentScript.getAttribute('data-bot-id') || '1',
        primaryColor: document.currentScript.getAttribute('data-primary-color') || '#007bff',
        greeting: document.currentScript.getAttribute('data-greeting') || 'Hi there! How can I help you?',
    };

    // Styles
    const styles = `
    .tsukai-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .tsukai-chat-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${CONFIG.primaryColor};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }

    .tsukai-chat-button:hover {
      transform: scale(1.05);
    }

    .tsukai-chat-button svg {
      width: 32px;
      height: 32px;
      fill: white;
    }

    .tsukai-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 100px);
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
    }

    .tsukai-chat-window.open {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }

    .tsukai-header {
      background-color: ${CONFIG.primaryColor};
      color: white;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tsukai-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .tsukai-close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 24px;
      padding: 0;
      line-height: 1;
    }

    .tsukai-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #f9fafb;
    }

    .tsukai-message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
    }

    .tsukai-message.user {
      align-self: flex-end;
      background-color: ${CONFIG.primaryColor};
      color: white;
      border-bottom-right-radius: 4px;
    }

    .tsukai-message.bot {
      align-self: flex-start;
      background-color: white;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 4px;
    }

    .tsukai-input-area {
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      background-color: white;
      display: flex;
      gap: 8px;
    }

    .tsukai-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .tsukai-input:focus {
      border-color: ${CONFIG.primaryColor};
    }

    .tsukai-send-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: ${CONFIG.primaryColor};
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tsukai-send-btn:disabled {
      color: #9ca3af;
      cursor: not-allowed;
    }

    .tsukai-typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      width: fit-content;
    }

    .tsukai-dot {
      width: 6px;
      height: 6px;
      background-color: #9ca3af;
      border-radius: 50%;
      animation: tsukai-bounce 1.4s infinite ease-in-out both;
    }

    .tsukai-dot:nth-child(1) { animation-delay: -0.32s; }
    .tsukai-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes tsukai-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    @media (max-width: 480px) {
      .tsukai-chat-window {
        width: calc(100vw - 40px);
        bottom: 90px;
        right: 20px;
        height: calc(100vh - 120px);
      }
    }
  `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create widget container
    const container = document.createElement('div');
    container.className = 'tsukai-widget-container';

    // Chat button
    const button = document.createElement('div');
    button.className = 'tsukai-chat-button';
    button.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
  `;

    // Chat window
    const window = document.createElement('div');
    window.className = 'tsukai-chat-window';
    window.innerHTML = `
    <div class="tsukai-header">
      <h3>Chat with us</h3>
      <button class="tsukai-close-btn">&times;</button>
    </div>
    <div class="tsukai-messages">
      <div class="tsukai-message bot">${CONFIG.greeting}</div>
    </div>
    <div class="tsukai-input-area">
      <input type="text" class="tsukai-input" placeholder="Type a message..." />
      <button class="tsukai-send-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  `;

    container.appendChild(window);
    container.appendChild(button);
    document.body.appendChild(container);

    // State
    let isOpen = false;
    let isTyping = false;
    let conversationId = localStorage.getItem('tsukai_conversation_id');

    // Elements
    const messagesContainer = window.querySelector('.tsukai-messages');
    const input = window.querySelector('.tsukai-input');
    const sendBtn = window.querySelector('.tsukai-send-btn');
    const closeBtn = window.querySelector('.tsukai-close-btn');

    // Functions
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            window.classList.add('open');
            button.style.display = 'none';
            input.focus();
            scrollToBottom();
        } else {
            window.classList.remove('open');
            setTimeout(() => {
                button.style.display = 'flex';
            }, 300);
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `tsukai-message ${sender}`;
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTyping() {
        if (isTyping) return;
        isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'tsukai-typing';
        typingDiv.innerHTML = '<div class="tsukai-dot"></div><div class="tsukai-dot"></div><div class="tsukai-dot"></div>';
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }

    function removeTyping(typingDiv) {
        if (typingDiv) {
            typingDiv.remove();
            isTyping = false;
        }
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Clear input
        input.value = '';
        addMessage(text, 'user');

        // Show typing indicator
        const typingDiv = showTyping();

        try {
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    botId: CONFIG.botId,
                    conversationId: conversationId ? parseInt(conversationId) : undefined,
                    channel: 'web'
                }),
            });

            const data = await response.json();

            removeTyping(typingDiv);

            if (data.success) {
                addMessage(data.response, 'bot');
                if (data.conversationId) {
                    conversationId = data.conversationId;
                    localStorage.setItem('tsukai_conversation_id', conversationId);
                }
            } else {
                addMessage('Sorry, something went wrong. Please try again.', 'bot');
            }
        } catch (error) {
            console.error('Tsukai Widget Error:', error);
            removeTyping(typingDiv);
            addMessage('Sorry, I cannot connect to the server right now.', 'bot');
        }
    }

    // Event Listeners
    button.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', sendMessage);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Load history if exists
    if (conversationId) {
        // Optional: Fetch history from API
        // fetch(`${CONFIG.apiEndpoint}?conversationId=${conversationId}`)
        //   .then(r => r.json())
        //   .then(data => {
        //     if (data.messages) {
        //       // Clear default greeting if we have history
        //       messagesContainer.innerHTML = '';
        //       data.messages.forEach(msg => {
        //         addMessage(msg.content, msg.role === 'user' ? 'user' : 'bot');
        //       });
        //     }
        //   });
    }

})();
