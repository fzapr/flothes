const apiKey = ""; 

async function generateStyleAdvice() {
    const inputEl = document.getElementById('ai-stylist-input');
    const outputEl = document.getElementById('ai-stylist-output');
    const btnEl = document.getElementById('ai-stylist-btn');
    const chatHistory = document.getElementById('ai-chat-history');
    const userText = inputEl.value.trim();

    if (!userText) return;

    const userBubble = document.createElement('div');
    userBubble.className = "bg-brand-900 text-white p-3 rounded-lg rounded-tr-none self-end border border-brand-900 max-w-[85%] mt-2 text-sm";
    userBubble.textContent = userText;
    chatHistory.insertBefore(userBubble, outputEl);
    
    inputEl.value = '';
    btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memikirkan...';
    btnEl.disabled = true;
    outputEl.classList.remove('hidden');
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{ parts: [{ text: userText }] }],
            systemInstruction: { parts: [{ text: "Kamu adalah Fashion Stylist AI eksklusif untuk brand 'Flothes'." }] }
        };

        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, sistem sedang sibuk.";
        
        const newAIBubble = document.createElement('div');
        newAIBubble.className = "bg-brand-100 p-3 rounded-lg rounded-tl-none self-start border border-gray-200 max-w-[85%] mt-2 leading-relaxed text-sm";
        newAIBubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
        chatHistory.insertBefore(newAIBubble, outputEl);
        
        outputEl.classList.add('hidden');
    } catch (error) {
        outputEl.innerHTML = '<span class="text-red-500">Maaf, terjadi kesalahan.</span>';
    } finally {
        btnEl.innerHTML = 'Kirim ✨'; btnEl.disabled = false;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}
window.generateStyleAdvice = generateStyleAdvice;
