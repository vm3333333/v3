from flask import Flask, render_template, jsonify, request
import pandas as pd
import numpy as np

app = Flask(__name__)

def load_data():
    df = pd.read_csv('portfolio_data.csv')
    df.columns = [col.strip() for col in df.columns]
    
    performance_cols = [
        'May 2019 - Apr 2020', 'May 2020 - Apr 2021',
        'May 2021 - Apr 2022', 'May 2022 - Apr 2023',
        'May 2023 - Apr 2024'
    ]
    for col in performance_cols:
        df[col] = df[col].str.rstrip('%').astype('float') / 100.0

    df['Performance Average'] = df[performance_cols].mean(axis=1)
    df['Overall Volatility'] = df[performance_cols].std(axis=1)
    df = df.replace({np.nan: None})
    
    return df

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    df = load_data()
    data = df.to_dict(orient='records')
    return jsonify(data)

@app.route('/add_fund', methods=['POST'])
def add_fund():
    df = load_data()
    new_fund = {
        'Fund Name': request.form['fund-name'],
        'Region': request.form['region'],
        'Risk Level': int(request.form['risk-level']),
        'Management Type': request.form['management-type'],
        'Number of Assets': int(request.form['number-of-assets']),
        'Ongoing Charge (OCF)': request.form['ongoing-charge'],
        'May 2019 - Apr 2020': None,
        'May 2020 - Apr 2021': None,
        'May 2021 - Apr 2022': None,
        'May 2022 - Apr 2023': None,
        'May 2023 - Apr 2024': None,
    }
    df = df.append(new_fund, ignore_index=True)
    df.to_csv('portfolio_data.csv', index=False)
    data = df.to_dict(orient='records')
    return jsonify(data)

@app.route('/bulk_update', methods=['POST'])
def bulk_update():
    df = load_data()
    file = request.files['bulk-update-csv']
    if file:
        update_df = pd.read_csv(file)
        update_df.columns = [col.strip() for col in update_df.columns]
        df.update(update_df)
        df.to_csv('portfolio_data.csv', index=False)
    data = df.to_dict(orient='records')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
