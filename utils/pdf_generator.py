from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime
import os


def generate_pdf_report(user_data, result):

    os.makedirs("reports", exist_ok=True)

    filename = (
        f"reports/credit_report_"
        f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    )

    c = canvas.Canvas(filename, pagesize=letter)

    c.setFont("Helvetica-Bold", 18)
    c.drawString(180, 760, "FinScoreAI Report")

    c.setFont("Helvetica", 12)

    y = 720

    c.drawString(
        50,
        y,
        f"Generated: {datetime.now()}"
    )

    y -= 40

    c.drawString(
        50,
        y,
        "Applicant Information"
    )

    y -= 25

    for key, value in user_data.items():

        c.drawString(
            60,
            y,
            f"{key}: {value}"
        )

        y -= 20

    y -= 20

    prediction_text = (
        "Creditworthy"
        if result["prediction"] == 1
        else "High Risk"
    )

    c.drawString(
        50,
        y,
        f"Result: {prediction_text}"
    )

    y -= 25

    c.drawString(
        50,
        y,
        f"Approval Probability: "
        f"{result['approval_probability']}%"
    )

    y -= 25

    c.drawString(
        50,
        y,
        f"Rejection Probability: "
        f"{result['rejection_probability']}%"
    )

    c.save()

    return filename