# Importing dependencies
from flask import Blueprint, render_template, request, session, redirect, url_for

main = Blueprint("main", __name__)

# Homepage routing
@main.route("/")
def landing():
    return render_template("landing_page.html")

# Step 1 profile page
@main.route("/profile_builder", methods=["GET", "POST"])
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
def pathways():
    profile_data = session.get("profile", {})

    if not profile_data:
        return redirect(url_for("main.quick_profile"))

    return render_template("pathways.html", profile_data=profile_data)
