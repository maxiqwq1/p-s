from flask import Blueprint, jsonify
from db import get_connection

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/stats", methods=["GET"])
def get_stats():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT r.nombre, COUNT(*) 
        FROM articulos a
        JOIN repositorios r ON r.id = a.repositorio_id
        GROUP BY r.nombre ORDER BY r.nombre
    """)
    por_repo = [{"repositorio": row[0], "total": row[1]} for row in cur.fetchall()]

    cur.execute("""
        SELECT anio, COUNT(*) FROM articulos
        WHERE anio IS NOT NULL
        GROUP BY anio ORDER BY anio
    """)
    por_anio = [{"anio": row[0], "total": row[1]} for row in cur.fetchall()]

    cur.execute("""
        SELECT tipo_documento, COUNT(*) FROM articulos
        WHERE tipo_documento IS NOT NULL
        GROUP BY tipo_documento ORDER BY COUNT(*) DESC
    """)
    por_tipo = [{"tipo": row[0], "total": row[1]} for row in cur.fetchall()]

    cur.execute("SELECT estado, COUNT(*) FROM articulos GROUP BY estado")
    por_estado = {row[0]: row[1] for row in cur.fetchall()}

    cur.execute("SELECT COUNT(*) FROM articulos")
    total = cur.fetchone()[0]

    cur.close()
    conn.close()

    return jsonify({
        "total": total,
        "por_repositorio": por_repo,
        "por_anio": por_anio,
        "por_tipo": por_tipo,
        "por_estado": por_estado,
    })