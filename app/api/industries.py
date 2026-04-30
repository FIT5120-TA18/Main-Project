from flask import Blueprint, jsonify
from db_conn import connection

industries_api = Blueprint("industries_api", __name__, url_prefix="/api")

@industries_api.route("/industries", methods=["GET"])
def get_industries():
    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT DISTINCT industry
                FROM hermap.industry_based_average_earnings
                WHERE industry IS NOT NULL
                AND industry != ''
                ORDER BY industry
            """

            cursor.execute(sql)
            rows = cursor.fetchall()

            results = [row[0] for row in rows]

        return jsonify(results)

    finally:
        conn.close()