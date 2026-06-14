from flask import Flask
from flask import render_template
from flask import request

from utils.load_metrics import get_metrics
from utils.predictor import predict_credit

app = Flask(__name__)

from flask import send_from_directory

@app.route('/google123456789abcdef.html')
def google_verify():
    return send_from_directory('.', 'google123456789abcdef.html')

@app.route("/")
def home():

    metrics = get_metrics()

    return render_template(
        "index.html",
        metrics=metrics
    )


@app.route("/predict", methods=["GET", "POST"])
def predict():

    if request.method == "POST":

        data = {
            "person_age": float(request.form["person_age"]),
            "person_gender": request.form["person_gender"],
            "person_education": request.form["person_education"],
            "person_income": float(request.form["person_income"]),
            "person_emp_exp": int(request.form["person_emp_exp"]),
            "person_home_ownership": request.form["person_home_ownership"],
            "loan_amnt": float(request.form["loan_amnt"]),
            "loan_intent": request.form["loan_intent"],
            "loan_int_rate": float(request.form["loan_int_rate"]),
            "loan_percent_income": float(request.form["loan_percent_income"]),
            "cb_person_cred_hist_length": float(
                request.form["cb_person_cred_hist_length"]
            ),
            "credit_score": int(
                request.form["credit_score"]
            ),
            "previous_loan_defaults_on_file":
                request.form[
                    "previous_loan_defaults_on_file"
                ]
        }

        result = predict_credit(data)

        global last_user_data
        global last_result

        last_user_data = data
        last_result = result

        return render_template(
            "result.html",
            result=result
        )

    return render_template("predict.html")


@app.route("/about")
def about():
    return render_template("about.html")

from flask import send_file
from utils.pdf_generator import generate_pdf_report

last_user_data = {}
last_result = {}

@app.route("/download-report")
def download_report():

    if not last_user_data:
        return "No report available"

    pdf_path = generate_pdf_report(
        last_user_data,
        last_result
    )

    return send_file(
        pdf_path,
        as_attachment=True
    )

if __name__ == "__main__":
    app.run(
        debug=True
    )