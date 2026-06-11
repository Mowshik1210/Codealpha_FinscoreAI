import json


def get_metrics():

    with open(
        "models/model_metrics.json",
        "r"
    ) as f:

        metrics = json.load(f)

    return metrics