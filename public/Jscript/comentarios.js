// API URL - Cambiar cuando despliegues en Render
const API_URL = 'https://backendwil.onrender.com';

// Estado global
let allComments = [];
let currentSort = 'newest';

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    loadComments();
    initializeEventListeners();
});

// Event Listeners
function initializeEventListeners() {
    // Formulario de comentario
    document.getElementById('commentForm').addEventListener('submit', handleSubmitComment);
    
    // Contador de caracteres
    document.getElementById('comment').addEventListener('input', updateCharCounter);
    
    // Ordenar comentarios
    document.getElementById('sortOrder').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderComments();
    });
    
    // Botón de actualizar
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadComments();
    });
}

// Enviar comentario
async function handleSubmitComment(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Obtener datos del formulario
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        comment: document.getElementById('comment').value.trim()
    };
    
    // Validación básica
    if (!formData.name || !formData.email || !formData.comment) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showAlert('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Validar longitud del comentario
    if (formData.comment.length < 10) {
        showAlert('El comentario debe tener al menos 10 caracteres', 'error');
        return;
    }
    
    // Mostrar loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('¡Comentario publicado con éxito ', 'success');
            form.reset();
            updateCharCounter();
            loadComments(); // Recargar comentarios
            
            // Scroll suave a los comentarios
            setTimeout(() => {
                document.querySelector('.comments-list').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500);
        } else {
            showAlert(data.error || 'Error al publicar el comentario', 'error');
        }
    } catch (error) {
        showAlert('Error de conexión. Verifica que el servidor esté activo.', 'error');
        console.error('Error:', error);
    } finally {
        // Restaurar botón
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Cargar comentarios
async function loadComments() {
    const commentsList = document.getElementById('commentsList');
    const noComments = document.getElementById('noComments');
    
    // Mostrar spinner
    commentsList.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Cargando comentarios...</p>
        </div>
    `;
    noComments.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/comments`);
        const data = await response.json();
        
        if (data.comments && data.comments.length > 0) {
            allComments = data.comments;
            renderComments();
            updateStats(data.comments.length);
        } else {
            commentsList.innerHTML = '';
            noComments.style.display = 'block';
            updateStats(0);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = `
            <div class="empty-state">
                <h3>Error al cargar comentarios</h3>
                <p>Verifica que el servidor esté activo.</p>
            </div>
        `;
        updateStats(0);
    }
}

// Renderizar comentarios
function renderComments() {
    const commentsList = document.getElementById('commentsList');
    const noComments = document.getElementById('noComments');
    
    if (allComments.length === 0) {
        commentsList.innerHTML = '';
        noComments.style.display = 'block';
        return;
    }
    
    // Ordenar comentarios
    let sortedComments = [...allComments];
    if (currentSort === 'newest') {
        sortedComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
        sortedComments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    
    // Renderizar
    commentsList.innerHTML = sortedComments.map(comment => createCommentCard(comment)).join('');
    noComments.style.display = 'none';
}

// Crear card de comentario
function createCommentCard(comment) {
    const initial = comment.name.charAt(0).toUpperCase();
    const date = formatDate(comment.created_at);
    const timeAgo = getTimeAgo(comment.created_at);
    
    return `
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">${initial}</div>
                    <div class="author-info">
                        <h3>${escapeHtml(comment.name)}</h3>
                        <span class="author-email">${escapeHtml(comment.email)}</span>
                    </div>
                </div>
                <div class="comment-date" title="${date}">
                    ${timeAgo}
                </div>
            </div>
            <div class="comment-body">
                ${escapeHtml(comment.comment)}
            </div>
        </div>
    `;
}

// Actualizar estadísticas
function updateStats(count) {
    document.getElementById('totalComments').textContent = count;
}

// Contador de caracteres
function updateCharCounter() {
    const textarea = document.getElementById('comment');
    const charCount = document.getElementById('charCount');
    charCount.textContent = textarea.value.length;
}

// Mostrar alerta
function showAlert(message, type) {
    const alert = document.getElementById('alert-message');
    alert.textContent = message;
    alert.className = `alert-box ${type}`;
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

// Formatear fecha completa
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

// Tiempo relativo (hace X tiempo)
function getTimeAgo(dateString) {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins === 1) return 'Hace 1 minuto';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours === 1) return 'Hace 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-resize del textarea
const textarea = document.getElementById('comment');
textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});