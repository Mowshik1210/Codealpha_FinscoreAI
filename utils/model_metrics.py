from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)


def calculate_metrics(y_true, y_pred, y_prob):

    metrics = {
        "accuracy": round(
            accuracy_score(y_true, y_pred) * 100,
            2
        ),

        "precision": round(
            precision_score(y_true, y_pred) * 100,
            2
        ),

        "recall": round(
            recall_score(y_true, y_pred) * 100,
            2
        ),

        "f1_score": round(
            f1_score(y_true, y_pred) * 100,
            2
        ),

        "roc_auc": round(
            roc_auc_score(y_true, y_prob) * 100,
            2
        )
    }

    return metrics