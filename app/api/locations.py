# Import necessary Dependencies
from flask import Blueprint, request, jsonify
from db_conn import connection

# Identifier for the API
api = Blueprint("api", __name__, url_prefix="/api")

# Obtain the list of localities from the Database for the selected state
@api.route("/locations", methods=["GET"])
def get_locations():
    state = request.args.get("state")
    search_term = request.args.get("q", "").strip()

    # Avoid unnecessary database calls until user has selected a state and inputs at least 2 characters.
    if not state or len(search_term) < 2:
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

            like_term = f"{search_term}%"
            cursor.execute(sql, (state, like_term, like_term))
            rows = cursor.fetchall()

            locations = [
                {
                    "locality": row[0],
                    "postcode": row[1]
                }
                for row in rows
            ]

        return jsonify(locations)

    finally:
        conn.close()