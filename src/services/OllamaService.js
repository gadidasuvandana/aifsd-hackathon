const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export const callOllama = async (prompt) => {
    const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gemma3',
            prompt: prompt,
            stream: false
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response:', data);

    if (data.error) {
        throw new Error(data.error);
    }

    return data;
};