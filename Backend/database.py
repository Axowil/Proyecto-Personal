import sqlite3
from datetime import datetime
import os

# 1. RUTA ABSOLUTA: Evita que se creen bases de datos en carpetas equivocadas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'portfolio.db')

def get_connection():
    """Crear conexión a la base de datos usando la ruta absoluta"""
    conn = sqlite3.connect(DB_PATH) 
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializar base de datos con soporte para HORA LOCAL"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Tabla de mensajes (cambiado a datetime local)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT (datetime('now', 'localtime')),
            read BOOLEAN DEFAULT 0
        )
    ''')
    
    # Tabla de comentarios (cambiado a datetime local)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT (datetime('now', 'localtime'))
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"✅ DB inicializada en: {DB_PATH}")

# ========== FUNCIONES PARA MENSAJES DE CONTACTO ==========

def save_message(name, email, subject, message):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    ''', (name, email, subject, message))
    
    message_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return message_id

def get_all_messages():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contact_messages ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# ========== FUNCIONES PARA COMENTARIOS ==========

def save_comment(name, email, comment):
    conn = get_connection()
    cursor = conn.cursor()
    # Usamos la hora local automática de la base de datos
    cursor.execute('''
        INSERT INTO comments (name, email, comment)
        VALUES (?, ?, ?)
    ''', (name, email, comment))
    
    comment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return comment_id

def get_all_comments():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM comments ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def delete_comment_by_id(comment_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM comments WHERE id = ?', (comment_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

if __name__ == '__main__':
    init_db()