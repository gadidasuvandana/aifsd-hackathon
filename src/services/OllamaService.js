const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export const callOllama = async (prompt, model = 'gemma3') => {
    try {
        // Add retry logic with exponential backoff
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                const response = await fetch(OLLAMA_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        model,
                        prompt,
                        stream: false,
                        options: {
                            temperature: 0.7,
                            top_p: 0.9,
                            max_tokens: 4000,
                            stop: ['</s>'],
                            timeout: 30000 // 30 seconds
                        }
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error);
                }

                if (!data.response) {
                    throw new Error('No response received from model');
                }

                return { response: data.response };
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) {
                    throw error;
                }
                
                // Exponential backoff
                const backoffTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                console.log(`Attempt ${retryCount} failed. Retrying in ${backoffTime/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
            }
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        if (!data.response) {
            throw new Error('No response received from model');
        }

        return { response: data.response };
    } catch (error) {
        console.error('Error in callOllama:', error);
        throw error;
    }
};