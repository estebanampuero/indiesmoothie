document.addEventListener('DOMContentLoaded', () => {
    const rawTextInput = document.getElementById('raw-text');
    const polishedTextInput = document.getElementById('polished-text');
    const smoothieBtn = document.getElementById('smoothie-btn');
    const loadingCat = document.getElementById('loading-cat');
    const copyBtn = document.getElementById('copy-btn');

    // Tono por defecto. Simplificamos la UI eliminando los botones.
    const selectedTone = 'amable pero profesional';

    smoothieBtn.addEventListener('click', async () => {
        const rawText = rawTextInput.value;
        if (!rawText.trim()) {
            polishedTextInput.value = "primero necesitas escribir algo en el lado oscuro...";
            return;
        }

        loadingCat.classList.remove('hidden');
        smoothieBtn.disabled = true;
        polishedTextInput.value = "procesando en la licuadora...";
        copyBtn.classList.add('hidden');

        try {
            const response = await fetch('/api/smoothie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: rawText,
                    tone: selectedTone
                }),
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
            polishedTextInput.value = `ups, la licuadora se trabó: ${error.message}. intenta de nuevo.`;
        } finally {
            loadingCat.classList.add('hidden');
            smoothieBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', () => {
        polishedTextInput.select();
        document.execCommand('copy');
        copyBtn.textContent = '¡copiado!';
        setTimeout(() => {
            copyBtn.textContent = 'copiar';
        }, 2000);
    });
});