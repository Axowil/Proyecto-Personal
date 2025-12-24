import sqlite3

def borrar_comentario(id_comentario):
    try:
        # Conectamos a tu base de datos local
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()

        # Ejecutamos el borrado
        cursor.execute("DELETE FROM comments WHERE id = ?", (id_comentario,))

        conn.commit()
        print(f" Comentario con ID {id_comentario} eliminado correctamente.")
        conn.close()
    except Exception as e:
        print(f" Error: {e}")

# Cambia el número 1 por el ID que quieras borrar (visto en tu tabla)
borrar_comentario(1)
