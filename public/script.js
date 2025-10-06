document.addEventListener('DOMContentLoaded', () => {
    const rawTextInput = document.getElementById('raw-text');
    const polishedTextInput = document.getElementById('polished-text');
    const smoothieBtn = document.getElementById('smoothie-btn');
    const copyBtn = document.getElementById('copy-btn');
    const copyTextSpan = copyBtn.querySelector('.copy-text');

    const selectedTone = 'amable pero profesional';

    smoothieBtn.addEventListener('click', async () => {
        const rawText = rawTextInput.value;
        if (!rawText.trim()) {
            polishedTextInput.value = "hey, necesitas confesar algo primero en el panel de la izquierda.";
            return;
        }

        smoothieBtn.classList.add('loading');
        smoothieBtn.disabled = true;
        polishedTextInput.value = "haciendo el licuado de palabras...";
        copyBtn.classList.add('hidden');

        try {
            const response = await fetch('/api/smoothie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: rawText, tone: selectedTone }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `error del servidor: ${response.statusText}`);
            }

            const data = await response.json();
            polishedTextInput.value = data.result;
            copyBtn.classList.remove('hidden');

        } catch (error) {
            console.error("Error al suavizar:", error);
            polishedTextInput.value = `ups, la magia falló: ${error.message}. intenta de nuevo.`;
        } finally {
            smoothieBtn.classList.remove('loading');
            smoothieBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', () => {
        if (!polishedTextInput.value) return;

        // Método moderno y seguro para copiar al portapapeles
        navigator.clipboard.writeText(polishedTextInput.value).then(() => {
            copyTextSpan.textContent = '¡copiado!';
            setTimeout(() => {
                copyTextSpan.textContent = 'copiar';
            }, 2000);
        }).catch(err => {
            console.error('falló la copia:', err);
            copyTextSpan.textContent = 'error';
        });
    });
});