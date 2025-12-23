import sqlite3

conn = sqlite3.connect('portfolio.db')
cursor = conn.cursor()

cursor.execute('SELECT * FROM comments')
comentarios = cursor.fetchall()

print(f"\n COMENTARIOS GUARDADOS: {len(comentarios)}\n")

for c in comentarios:
    print(f"Nombre: {c[1]}")
    print(f"Email: {c[2]}")
    print(f"Comentario: {c[3]}")
    print(f"Fecha: {c[4]}")
    print("-" * 50)

conn.close()