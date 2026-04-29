# Importing dependencies
import os
from functools import wraps
from flask import Blueprint, render_template, request, session, redirect, url_for

main = Blueprint("main", __name__)

def access_required(route_function):
    @wraps(route_function)
    def wrapper(*args, **kwargs):
        if not session.get("access_granted"):
            return redirect(url_for("main.login"))
        return route_function(*args, **kwargs)
    return wrapper

# Manage Login
@main.route("/login", methods=["GET", "POST"])
def login():
    if session.get("access_granted"):
        return redirect(url_for("main.landing"))

    if request.method == "POST":
        password = request.form.get("password", "").strip()
        correct_password = os.getenv("SITE_PASSWORD")

        if password == correct_password:
            session["access_granted"] = True
            return redirect(url_for("main.landing"))

        return render_template("login.html", error="Incorrect password")

    return render_template("login.html", error="")

# Homepage routing
@main.route("/")
@access_required
def landing():
    return render_template("landing_page.html")

# Step 1 profile page
@main.route("/profile_builder", methods=["GET", "POST"])
@access_required
def quick_profile():

    # Add the form data to the session storage
    if request.method == "POST":
        data = request.form.to_dict()
        session["profile"] = data

        # Debugging locally
        # print("FORM DATA:", data)
        # print("SESSION DATA:", dict(session))

        # Move to next page
        return redirect(url_for("main.quick_profile_step_2"))

    # Check for existing data in the session storage and add it
    profile_data = session.get("profile", {})
    return render_template("profile_build_1.html", profile_data=profile_data)

@main.route("/quick-profile-step-2", methods=["GET", "POST"])
@access_required
def quick_profile_step_2():
    profile_data = session.get("profile", {})

    # If session is empty, user cannot access step 2 directly
    if not profile_data:
        return redirect(url_for("main.quick_profile"))

    if request.method == "POST":
        selected_goal = request.form.get("goal", "").strip()

        if selected_goal:
            profile_data["goal"] = selected_goal
            session["profile"] = profile_data
            return redirect(url_for("main.pathways"))

        return render_template(
            "profile_build_2.html",
            profile_data=profile_data,
            goal_error="Please select one option to continue."
        )

    # Validation check
    return render_template(
        "profile_build_2.html",
        profile_data=profile_data,
        goal_error=""
    )

@main.route("/pathways")
@access_required
def pathways():
    profile_data = session.get("profile", {})

    if not profile_data:
        return redirect(url_for("main.quick_profile"))

    return render_template("pathways.html", profile_data=profile_data)