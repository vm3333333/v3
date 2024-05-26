from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def data():
    df = pd.read_csv('portfolio_data.csv')

    # Convert performance columns to numeric, forcing errors to NaN
    performance_columns = ['May 2019 - Apr 2020', 'May 2020 - Apr 2021', 'May 2021 - Apr 2022', 'May 2022 - Apr 2023', 'May 2023 - Apr 2024']
    for column in performance_columns:
        df[column] = pd.to_numeric(df[column], errors='coerce')

    # Calculate Performance Average
    df['Performance Average'] = df[performance_columns].mean(axis=1, skipna=True)

    # Calculate Overall Volatility
    df['Overall Volatility'] = df[performance_columns].std(axis=1, skipna=True)

    # Replace NaN with None for JSON serialization
    df = df.where(pd.notnull(df), None)

    # Convert DataFrame to JSON-friendly format
    data = df.to_dict(orient='records')

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
