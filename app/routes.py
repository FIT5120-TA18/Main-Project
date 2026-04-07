# Routing for different pages
from flask import Blueprint, render_template

main = Blueprint("main", __name__)

@main.route("/")
def landing():
    return render_template("landing.html")

@main.route("/quick-profile")
def quick_profile():
    return render_template("quick_profile.html")

@main.route("/quick-profile-step-2")
def quick_profile_step_2():
    return "<h1 style='font-family: Arial; padding: 40px;'>Step 2 coming next</h1>"