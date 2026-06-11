import joblib
import pandas as pd

model = joblib.load(
    "models/credit_model.pkl"
)

def predict_credit(data):

    df = pd.DataFrame([data])

    prediction = model.predict(df)[0]

    probability = model.predict_proba(df)[0]

    print("Prediction:", prediction)
    print("Probability Array:", probability)
    

    return {
    "prediction": int(prediction),
    "approval_probability": round(probability[0] * 100, 2),
    "rejection_probability": round(probability[1] * 100, 2),
    "debug_probs": str(probability)
}
