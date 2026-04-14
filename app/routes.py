from flask import Blueprint, render_template, request, session, redirect, url_for

main = Blueprint("main", __name__)


@main.route("/")
def landing():
    return render_template("landing.html")


@main.route("/quick-profile", methods=["GET", "POST"])
def quick_profile():
    if request.method == "POST":
        data = request.form.to_dict()
        session["profile"] = data
        return redirect(url_for("main.quick_profile_step_2"))

    return render_template("quick_profile.html")


@main.route("/quick-profile-step-2", methods=["GET", "POST"])
def quick_profile_step_2():
    if request.method == "POST":
        goal = request.form.get("goal")
        if session.get("profile"):
            session["profile"]["goal"] = goal
        return redirect(url_for("main.pathway_builder"))

    return render_template("quick_profile_step_2.html")


@main.route("/pathway-builder", methods=["GET", "POST"])
def pathway_builder():
    if request.method == "POST":
        pathways = {
            "pathwayA": {
                "name": request.form.get("pathwayA_name", "Pathway A"),
                "living": request.form.get("pathwayA_living"),
                "work": request.form.get("pathwayA_work"),
                "study": request.form.get("pathwayA_study"),
            }
        }
        
        # Check if Pathway B exists
        if request.form.get("pathwayB_living"):
            pathways["pathwayB"] = {
                "name": request.form.get("pathwayB_name", "Pathway B"),
                "living": request.form.get("pathwayB_living"),
                "work": request.form.get("pathwayB_work"),
                "study": request.form.get("pathwayB_study"),
            }
        
        session["pathways"] = pathways
        return redirect(url_for("main.results"))

    return render_template("pathway_builder.html")


@main.route("/results")
def results():
    profile = session.get("profile", {})
    pathways = session.get("pathways", {})
    
    return render_template("results.html", profile=profile, pathways=pathways)


@main.route("/education/housing-stress")
def education_housing_stress():
    return render_template("education_housing_stress.html")


@main.route("/education/payslip")
def education_payslip():
    return render_template("education_payslip.html")


@main.route("/education/moving-costs")
def education_moving_costs():
    return render_template("education_moving_costs.html")
