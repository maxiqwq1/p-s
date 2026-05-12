from flask import Blueprint, jsonify, request
from db import get_connection

articulos_bp = Blueprint("articulos", __name__)

@articulos_bp.route("/articulos", methods=["GET"])
def listar_articulos():
    repositorio = request.args.get("repositorio")
    anio = request.args.get("anio")
    tipo = request.args.get("tipo")
    buscar = request.args.get("buscar")
    estado = request.args.get("estado")

    conditions = []
    params = []

    if repositorio:
        conditions.append("r.nombre = %s")
        params.append(repositorio)
    if anio:
        conditions.append("a.anio = %s")
        params.append(int(anio))
    if tipo:
        conditions.append("a.tipo_documento = %s")
        params.append(tipo)
    if estado:
        conditions.append("a.estado = %s")
        params.append(estado)
    if buscar:
        conditions.append("(LOWER(a.titulo) LIKE %s OR LOWER(a.autores) LIKE %s OR LOWER(a.fuente_revista) LIKE %s)")
        like = f"%{buscar.lower()}%"
        params += [like, like, like]

    where = "WHERE " + " AND ".join(conditions) if conditions else ""

    query = f"""
        SELECT a.id, a.titulo, a.autores, a.anio, a.fuente_revista,
               a.tipo_documento, a.citado_por, a.doi, a.link,
               a.estado, a.razon_exclusion, r.nombre AS repositorio
        FROM articulos a
        JOIN repositorios r ON r.id = a.repositorio_id
        {where}
        ORDER BY a.anio DESC, a.citado_por DESC
    """

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([{
        "id": r[0],
        "titulo": r[1],
        "autores": r[2],
        "anio": r[3],
        "fuente_revista": r[4],
        "tipo_documento": r[5],
        "citado_por": r[6],
        "doi": r[7],
        "link": r[8],
        "estado": r[9],
        "razon_exclusion": r[10],
        "repositorio": r[11],
    } for r in rows])


@articulos_bp.route("/articulos/<int:id>/estado", methods=["PATCH"])
def cambiar_estado(id):
    data = request.get_json()
    nuevo_estado = data.get("estado")
    razon = data.get("razon_exclusion", None)

    if nuevo_estado not in ["pendiente", "incluido", "excluido"]:
        return jsonify({"error": "Estado inválido"}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE articulos SET estado = %s, razon_exclusion = %s WHERE id = %s",
        (nuevo_estado, razon, id)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Estado actualizado", "id": id, "estado": nuevo_estado})