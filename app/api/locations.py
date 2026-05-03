# Import necessary Dependencies
from flask import Blueprint, request, jsonify
from db_conn import connection
import json

# Identifier for the API
api = Blueprint("api", __name__, url_prefix="/api")

# Obtain the list of localities from the Database for the selected state
@api.route("/locations", methods=["GET"])
def get_locations():
    # state = request.args.get("state")
    search_term = request.args.get("q", "").strip()

    # Avoid unnecessary database calls until user has selected a state and inputs at least 2 characters.
    if len(search_term) < 2:
        return jsonify([])

    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT DISTINCT locality, postcode
                FROM hermap.locations_data
                WHERE 
                    locality LIKE %s
                    OR postcode LIKE %s
                ORDER BY locality
                LIMIT 10
            """

            like_term = f"{search_term}%"
            cursor.execute(sql, (like_term, like_term))
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
@api.route("/lga-from-location", methods=["GET"])
def get_lga_from_location():
    postcode = request.args.get("postcode", "").strip()
    locality = request.args.get("locality", "").strip()

    if not postcode and not locality:
        return jsonify({})

    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT DISTINCT 
                    p.lgacode,
                    b.lga_name
                FROM hermap.postcode_lgacode_vic p
                JOIN hermap.lga_boundaries_vic b
                    ON p.lgacode = b.lgacode
                WHERE p.postcode = %s
                   OR p.locality = %s
                LIMIT 1
            """

            cursor.execute(sql, (postcode, locality))
            row = cursor.fetchone()

            if not row:
                return jsonify({})

            return jsonify({
                "lgacode": row[0],
                "lga_name": row[1]
            })

    finally:
        conn.close()

@api.route("/lgas", methods=["GET"])
def get_lgas():
    search_term = request.args.get("q", "").strip()

    if len(search_term) < 2:
        return jsonify([])

    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT DISTINCT lgacode, lga_name
                FROM hermap.lga_boundaries_vic
                WHERE lga_name LIKE %s
                ORDER BY lga_name
                LIMIT 10
            """

            like_term = f"{search_term}%"
            cursor.execute(sql, (like_term,))
            rows = cursor.fetchall()

            return jsonify([
                {
                    "lgacode": row[0],
                    "lga_name": row[1]
                }
                for row in rows
            ])

    finally:
        conn.close()

@api.route("/suburbs-by-lga", methods=["GET"])
def get_suburbs_by_lga():
    lgacode = request.args.get("lgacode", "").strip()

    if not lgacode:
        return jsonify([])

    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                    SELECT
                        m.locality,
                        m.postcode,
                        m.`09-25` AS weekly_rent
                    FROM hermap.median_rent_vic_1br m
                    WHERE m.lgacode = %s
                      AND m.`09-25` IS NOT NULL
                    ORDER BY m.`09-25` ASC
                """

            cursor.execute(sql, (lgacode,))
            rows = cursor.fetchall()

            suburbs = [
                {
                    "name": row[0],
                    "postcode": row[1],
                    "rent": float(row[2]) if row[2] is not None else None
                }
                for row in rows
            ]

            return jsonify(suburbs)

    finally:
        conn.close()

@api.route("/suburb-rent-map", methods=["GET"])
def get_suburb_rent_map():
    lgacode = request.args.get("lgacode", "").strip()

    if not lgacode:
        return jsonify({"type": "FeatureCollection", "features": []})

    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
    SELECT
        s.sal_code,
        s.suburb_name,
        m.postcode,
        m.`09-25` AS weekly_rent,
        ST_AsGeoJSON(s.boundary) AS geometry
    FROM hermap.median_rent_vic m
    JOIN hermap.suburb_boundaries_vic s
        ON LOWER(TRIM(m.locality)) =
           LOWER(TRIM(REPLACE(s.suburb_name, ' (Vic.)', '')))
    WHERE m.lgacode = %s
      AND m.`09-25` IS NOT NULL
    ORDER BY m.`09-25` ASC
"""

            cursor.execute(sql, (lgacode,))
            rows = cursor.fetchall()

            features = []

            for row in rows:
                if not row[4]:
                    continue

                features.append({
                    "type": "Feature",
                    "properties": {
                        "sal_code": row[0],
                        "suburb_name": row[1],
                        "postcode": row[2],
                        "rent": float(row[3]) if row[3] is not None else None
                    },
                    "geometry": json.loads(row[4])
                })

            return jsonify({
                "type": "FeatureCollection",
                "features": features
            })

    finally:
        conn.close()

@api.route("/lga-boundary", methods=["GET"])
def get_lga_boundary():
    lgacode = request.args.get("lgacode", "").strip()

    if not lgacode:
        return jsonify({"type": "FeatureCollection", "features": []})

    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT
                    lgacode,
                    lga_name,
                    ST_AsGeoJSON(boundary) AS geometry
                FROM hermap.lga_boundaries_vic
                WHERE lgacode = %s
                LIMIT 1
            """

            cursor.execute(sql, (lgacode,))
            row = cursor.fetchone()

            if not row:
                return jsonify({"type": "FeatureCollection", "features": []})

            return jsonify({
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {
                            "lgacode": row[0],
                            "lga_name": row[1]
                        },
                        "geometry": json.loads(row[2])
                    }
                ]
            })

    finally:
        conn.close()

# @api.route("/lga-rent-map", methods=["GET"])
# def get_lga_rent_map():
#     conn = connection()

#     try:
#         with conn.cursor() as cursor:
#             sql = """
#                 SELECT
#                     l.lgacode,
#                     l.lga_name,
#                     AVG(m.`09-25`) AS avg_lga_rent,
#                     ST_AsGeoJSON(l.boundary) AS geometry
#                 FROM hermap.lga_boundaries_vic l
#                 LEFT JOIN hermap.median_rent_vic m
#                     ON l.lgacode = m.lgacode
#                 GROUP BY l.lgacode, l.lga_name, l.boundary
#             """

#             cursor.execute(sql)
#             rows = cursor.fetchall()

#             features = []

#             for row in rows:
#                 if not row[3]:
#                     continue

#                 features.append({
#                     "type": "Feature",
#                     "properties": {
#                         "lgacode": row[0],
#                         "lga_name": row[1],
#                         "rent": float(row[2]) if row[2] is not None else None
#                     },
#                     "geometry": json.loads(row[3])
#                 })

#             return jsonify({
#                 "type": "FeatureCollection",
#                 "features": features
#             })

#     finally:
#         conn.close()

@api.route("/all-lgas", methods=["GET"])
def get_all_lgas():
    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT DISTINCT lgacode, lga_name
                FROM hermap.lga_boundaries_vic
                ORDER BY lga_name
            """

            cursor.execute(sql)
            rows = cursor.fetchall()

            return jsonify([
                {
                    "lgacode": row[0],
                    "lga_name": row[1]
                }
                for row in rows
            ])

    finally:
        conn.close()


@api.route("/lga-rent-map", methods=["GET"])
def get_lga_rent_map():
    conn = connection()

    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT
                    l.lgacode,
                    l.lga_name,

                    AVG(m.`03-21`) AS rent_03_21,
                    AVG(m.`06-21`) AS rent_06_21,
                    AVG(m.`09-21`) AS rent_09_21,
                    AVG(m.`12-21`) AS rent_12_21,
                    AVG(m.`03-22`) AS rent_03_22,
                    AVG(m.`06-22`) AS rent_06_22,
                    AVG(m.`09-22`) AS rent_09_22,
                    AVG(m.`12-22`) AS rent_12_22,
                    AVG(m.`03-23`) AS rent_03_23,
                    AVG(m.`06-23`) AS rent_06_23,
                    AVG(m.`09-23`) AS rent_09_23,
                    AVG(m.`12-23`) AS rent_12_23,
                    AVG(m.`03-24`) AS rent_03_24,
                    AVG(m.`06-24`) AS rent_06_24,
                    AVG(m.`09-24`) AS rent_09_24,
                    AVG(m.`12-24`) AS rent_12_24,
                    AVG(m.`03-25`) AS rent_03_25,
                    AVG(m.`06-25`) AS rent_06_25,
                    AVG(m.`09-25`) AS rent_09_25,

                    ST_AsGeoJSON(l.boundary) AS geometry
                FROM hermap.lga_boundaries_vic l
                LEFT JOIN hermap.median_rent_vic m
                    ON l.lgacode = m.lgacode
                GROUP BY l.lgacode, l.lga_name, l.boundary
            """

            cursor.execute(sql)
            rows = cursor.fetchall()

            quarters = [
                "03-21", "06-21", "09-21", "12-21",
                "03-22", "06-22", "09-22", "12-22",
                "03-23", "06-23", "09-23", "12-23",
                "03-24", "06-24", "09-24", "12-24",
                "03-25", "06-25", "09-25"
            ]

            features = []

            for row in rows:
                history = [
                    round(float(value), 2) if value is not None else None
                    for value in row[2:21]
                ]

                latest_rent = history[-1] if history else None

                features.append({
                    "type": "Feature",
                    "properties": {
                        "lgacode": row[0],
                        "lga_name": row[1],
                        "rent": latest_rent,
                        "history_labels": quarters,
                        "history": history
                    },
                    "geometry": json.loads(row[21])
                })

            return jsonify({
                "type": "FeatureCollection",
                "features": features
            })

    finally:
        conn.close()