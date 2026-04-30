# Importing Dependencies
from flask import Blueprint, jsonify
from db_conn import connection

# API Identifier for Data Retrieval
industries_api = Blueprint("industries_api", __name__, url_prefix="/api")

# API for getting Industries list (Profile Builder Form)
@industries_api.route("/industries", methods=["GET"])
def get_industries():
    """Return all distinct industry names for the profile form dropdown."""
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

            industries = [row[0] for row in rows]

        return jsonify(industries)

    finally:
        conn.close()

# API for getting Industries table (Dashboard Chart on load)
@industries_api.route("/industry-chart", methods=["GET"])
def get_industry_chart():
    """Return top 5 industries by 2022-23 average earnings for dashboard chart."""
    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT 
                    industry,
                    `2021-22`,
                    `2022-23`
                FROM hermap.industry_based_average_earnings
                WHERE industry IS NOT NULL
                AND industry != ''
                AND `2021-22` IS NOT NULL
                AND `2022-23` IS NOT NULL
                ORDER BY `2022-23` DESC
                LIMIT 5
            """

            cursor.execute(sql)
            rows = cursor.fetchall()

            chart_data = [
                {
                    "industry": row[0],
                    "year_2021_22": float(row[1]),
                    "year_2022_23": float(row[2])
                }
                for row in rows
            ]

        return jsonify(chart_data)

    finally:
        conn.close()