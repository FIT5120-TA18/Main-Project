from flask import Blueprint, render_template, request, session, redirect, url_for

main = Blueprint("main", __name__)


@main.route("/")
def landing():
    return render_template("landing.html")


@main.route("/quick-profile", methods=["GET", "POST"])
def quick_profile():
    if request.method == "POST":
        data = request.form.to_dict()

        # Save to session
        session["profile"] = data

        # Debug prints
        print("FORM DATA:", data)
        print("SESSION DATA:", dict(session))

        # Redirect to next step
        return redirect(url_for("main.quick_profile_step_2"))

    return render_template("quick_profile.html")


@main.route("/quick-profile-step-2")
def quick_profile_step_2():
    profile = session.get("profile", {})

    return f"""
    <h1 style='font-family: Arial; padding: 40px;'>
        Step 2 coming next
    </h1>
    <pre style='padding: 20px; background:#f4f4f4;'>
        {profile}
    </pre>
    """