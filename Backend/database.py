import sqlite3
from datetime import datetime
import os

# Nombre de la base de datos
DB_NAME = 'portfolio.db'

def get_connection():
    """Crear conexión a la base de datos"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # Permite acceder a columnas por nombre
    return conn

def init_db():
    """Inicializar base de datos y crear tabla de contactos"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Crear tabla de mensajes de contacto
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            read BOOLEAN DEFAULT 0
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Base de datos inicializada correctamente")

def save_message(name, email, subject, message):
    """Guardar nuevo mensaje de contacto"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    ''', (name, email, subject, message))
    
    message_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    print(f"✅ Mensaje guardado con ID: {message_id}")
    return message_id

def get_all_messages():
    """Obtener todos los mensajes (ordenados por fecha descendente)"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, name, email, subject, message, created_at, read
        FROM contact_messages
        ORDER BY created_at DESC
    ''')
    
    rows = cursor.fetchall()
    conn.close()
    
    # Convertir a lista de diccionarios
    messages = []
    for row in rows:
        messages.append({
            'id': row['id'],
            'name': row['name'],
            'email': row['email'],
            'subject': row['subject'],
            'message': row['message'],
            'created_at': row['created_at'],
            'read': bool(row['read'])
        })
    
    return messages

def get_message_by_id(message_id):
    """Obtener un mensaje específico por ID"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM contact_messages WHERE id = ?
    ''', (message_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return dict(row)
    return None

def mark_as_read(message_id):
    """Marcar mensaje como leído"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE contact_messages SET read = 1 WHERE id = ?
    ''', (message_id,))
    
    conn.commit()
    conn.close()

def delete_message_by_id(message_id):
    """Eliminar mensaje por ID"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM contact_messages WHERE id = ?', (message_id,))
    affected = cursor.rowcount
    
    conn.commit()
    conn.close()
    
    return affected > 0

def get_unread_count():
    """Contar mensajes no leídos"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as count FROM contact_messages WHERE read = 0')
    count = cursor.fetchone()['count']
    
    conn.close()
    return count

# Crear la base de datos si no existe
if __name__ == '__main__':
    init_db()
    print("Base de datos creada exitosamente")