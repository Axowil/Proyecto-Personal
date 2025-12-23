// API URL - Cambiar cuando despliegues en Render
const API_URL = 'http://localhost:5000/api';

// Enviar formulario
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Obtener datos del formulario
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Validación básica
    if (!formData.name || !formData.email || !formData.message) {
        showAlert('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showAlert('Por favor ingresa un email válido', 'error');
        return;
    }

    // Mostrar loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
            form.reset();
            loadMessages(); // Recargar mensajes
            
            // Scroll suave hacia arriba
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            showAlert(data.error || 'Error al enviar el mensaje', 'error');
        }
    } catch (error) {
        showAlert('Error de conexión. Verifica que el servidor backend esté activo.', 'error');
        console.error('Error:', error);
    } finally {
        // Restaurar botón
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Mostrar alerta
function showAlert(message, type) {
    const alert = document.getElementById('message-alert');
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    alert.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.style.opacity = '1';
        }, 300);
    }, 5000);
}

// Cargar mensajes recientes
async function loadMessages() {
    const messagesList = document.getElementById('messages-list');
    
    // Mostrar loading
    messagesList.innerHTML = '<p class="no-messages">Cargando mensajes...</p>';
    
    try {
        const response = await fetch(`${API_URL}/messages`);
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
            messagesList.innerHTML = data.messages.map(msg => `
                <div class="message-card">
                    <div class="message-header">
                        <h3>${escapeHtml(msg.name)}</h3>
                        <span class="message-date">${formatDate(msg.created_at)}</span>
                    </div>
                    <p class="message-email">📧 ${escapeHtml(msg.email)}</p>
                    ${msg.subject ? `<p class="message-subject"><strong>Asunto:</strong> ${escapeHtml(msg.subject)}</p>` : ''}
                    <p class="message-text">${escapeHtml(msg.message)}</p>
                </div>
            `).join('');
        } else {
            messagesList.innerHTML = '<p class="no-messages">No hay mensajes aún. ¡Sé el primero en escribir!</p>';
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesList.innerHTML = '<p class="no-messages">⚠️ Error al cargar mensajes. Verifica que el servidor esté activo.</p>';
    }
}

// Formatear fecha
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-resize del textarea
const textarea = document.getElementById('message');
textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Cargar mensajes al inicio
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
});

// Recargar mensajes cada 30 segundos (opcional)
setInterval(loadMessages, 30000);