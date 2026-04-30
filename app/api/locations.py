from flask import Blueprint, request, jsonify
from db_conn import connection

api = Blueprint("api", __name__, url_prefix="/api")

@api.route("/locations", methods=["GET"])
def get_locations():
    state = request.args.get("state")
    search = request.args.get("q", "").strip()

    if not state or len(search) < 2:
        return jsonify([])

    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT DISTINCT locality, postcode
                FROM hermap.locations_data
                WHERE state = %s
                AND (
                    locality LIKE %s
                    OR postcode LIKE %s
                )
                ORDER BY locality
                LIMIT 10
            """

            like_term = f"{search}%"
            cursor.execute(sql, (state, like_term, like_term))
            rows = cursor.fetchall()

            results = [
                {
                    "locality": row[0],
                    "postcode": row[1]
                }
                for row in rows
            ]

        return jsonify(results)

    finally:
        conn.close()