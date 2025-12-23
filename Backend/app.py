from flask import Flask, request, jsonify
from flask_cors import CORS
from database import (
    init_db, 
    save_message, 
    get_all_messages,
    save_comment,
    get_all_comments,
    delete_comment_by_id
)
import os

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde el frontend

# Inicializar base de datos al arrancar
init_db()

@app.route('/')
def home():
    return jsonify({
        "message": "API Portfolio - Sistema de Contacto y Comentarios",
        "endpoints": {
            "POST /api/contact": "Enviar mensaje de contacto",
            "GET /api/messages": "Obtener todos los mensajes",
            "POST /api/comments": "Publicar comentario",
            "GET /api/comments": "Obtener todos los comentarios",
            "DELETE /api/comments/:id": "Eliminar comentario"
        }
    })

# ========== ENDPOINTS DE CONTACTO ==========

@app.route('/api/contact', methods=['POST'])
def contact():
    """Recibir y guardar mensaje de contacto"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({
                "error": "Nombre, email y mensaje son obligatorios"
            }), 400
        
        # Guardar en base de datos
        message_id = save_message(
            name=data['name'],
            email=data['email'],
            subject=data.get('subject', ''),
            message=data['message']
        )
        
        return jsonify({
            "success": True,
            "message": "Mensaje recibido correctamente",
            "id": message_id
        }), 201
        
    except Exception as e:
        return jsonify({
            "error": f"Error al procesar el mensaje: {str(e)}"
        }), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Obtener todos los mensajes (ordenados por fecha descendente)"""
    try:
        messages = get_all_messages()
        return jsonify({
            "success": True,
            "count": len(messages),
            "messages": messages
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Error al obtener mensajes: {str(e)}"
        }), 500

# ========== ENDPOINTS DE COMENTARIOS ==========

@app.route('/api/comments', methods=['POST'])
def create_comment():
    """Publicar nuevo comentario"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('name') or not data.get('email') or not data.get('comment'):
            return jsonify({
                "error": "Nombre, email y comentario son obligatorios"
            }), 400
        
        # Validar longitud del comentario
        if len(data['comment']) < 10:
            return jsonify({
                "error": "El comentario debe tener al menos 10 caracteres"
            }), 400
        
        if len(data['comment']) > 500:
            return jsonify({
                "error": "El comentario no puede superar los 500 caracteres"
            }), 400
        
        # Guardar en base de datos
        comment_id = save_comment(
            name=data['name'],
            email=data['email'],
            comment=data['comment']
        )
        
        return jsonify({
            "success": True,
            "message": "Comentario publicado correctamente",
            "id": comment_id
        }), 201
        
    except Exception as e:
        return jsonify({
            "error": f"Error al publicar comentario: {str(e)}"
        }), 500

@app.route('/api/comments', methods=['GET'])
def get_comments():
    """Obtener todos los comentarios (ordenados por fecha descendente)"""
    try:
        comments = get_all_comments()
        return jsonify({
            "success": True,
            "count": len(comments),
            "comments": comments
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Error al obtener comentarios: {str(e)}"
        }), 500

@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    """Eliminar un comentario por ID (opcional - para admin)"""
    try:
        success = delete_comment_by_id(comment_id)
        
        if success:
            return jsonify({
                "success": True,
                "message": "Comentario eliminado"
            }), 200
        else:
            return jsonify({
                "error": "Comentario no encontrado"
            }), 404
            
    except Exception as e:
        return jsonify({
            "error": f"Error al eliminar comentario: {str(e)}"
        }), 500

@app.route('/api/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    """Eliminar un mensaje por ID (opcional - para admin)"""
    try:
        from database import delete_message_by_id
        success = delete_message_by_id(message_id)
        
        if success:
            return jsonify({
                "success": True,
                "message": "Mensaje eliminado"
            }), 200
        else:
            return jsonify({
                "error": "Mensaje no encontrado"
            }), 404
            
    except Exception as e:
        return jsonify({
            "error": f"Error al eliminar mensaje: {str(e)}"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)