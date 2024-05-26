# app.py

from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np

app = Flask(__name__)

def load_data():
    df = pd.read_csv('portfolio_data.csv')
    print(df.columns)
    years = [2019, 2020, 2021, 2022, 2023]
    performance_cols = []

    for year in years:
        col_name = f'May {year} - Apr {year+1}'
        if col_name in df.columns:
            df[col_name] = pd.to_numeric(df[col_name].str.replace('%', ''), errors='coerce')
            performance_cols.append(col_name)
    
    df['Performance Average'] = df[performance_cols].mean(axis=1)
    df['Overall Volatility'] = df[performance_cols].std(axis=1)
    df = df.where(pd.notnull(df), None)  # Convert NaN to None for JSON compatibility
    
    return df

@app.route('/')
def index():
    df = load_data()
    data = df.to_dict(orient='records')
    return render_template('index.html', data=data)

@app.route('/api/data')
def get_data():
    df = load_data()
    data = df.to_dict(orient='records')
    for record in data:
        for key, value in record.items():
            if isinstance(value, (np.float64, np.int64)):
                record[key] = float(value)
            if pd.isna(value):  # Ensure NaN values are converted to None
                record[key] = None
    print(data)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
