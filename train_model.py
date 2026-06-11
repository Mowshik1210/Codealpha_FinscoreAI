import pandas as pd
import joblib
import os

from sklearn import metrics
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report
from sklearn.metrics import roc_auc_score

from utils.model_metrics import calculate_metrics
from utils.preprocess import create_preprocessor

os.makedirs("models", exist_ok=True)

df = pd.read_csv("dataset/credit_score_data.csv")

X = df.drop("loan_status", axis=1)
y = df["loan_status"]

preprocessor = create_preprocessor()
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    random_state=42
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", model)
])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)

y_prob = pipeline.predict_proba(X_test)[:, 1]

metrics = calculate_metrics(
    y_test,
    y_pred,
    y_prob
)

print("\nModel Performance")

print(f"Accuracy : {metrics['accuracy']}%")
print(f"Precision: {metrics['precision']}%")
print(f"Recall   : {metrics['recall']}%")
print(f"F1 Score : {metrics['f1_score']}%")
print(f"ROC AUC  : {metrics['roc_auc']}%")

print(classification_report(
    y_test,
    y_pred
))

joblib.dump(
    pipeline,
    "models/credit_model.pkl"
)

joblib.dump(
    X.columns.tolist(),
    "models/feature_columns.pkl"
)

print("Model saved successfully.")

import json

with open(
    "models/model_metrics.json",
    "w"
) as f:

    json.dump(
        metrics,
        f,
        indent=4
    )