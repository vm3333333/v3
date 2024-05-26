from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

performance_cols = ['May 2019 - Apr 2020', 'May 2020 - Apr 2021', 'May 2021 - Apr 2022', 'May 2022 - Apr 2023', 'May 2023 - Apr 2024']

def load_data():
    df = pd.read_csv('portfolio_data.csv')
    df[performance_cols] = df[performance_cols].apply(pd.to_numeric, errors='coerce')
    df['Performance Average'] = df[performance_cols].mean(axis=1)
    df['Overall Volatility'] = df[performance_cols].std(axis=1)
    return df

def save_data(df):
    df.to_csv('portfolio_data.csv', index=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    df = load_data()
    return jsonify(df.to_dict(orient='records'))

@app.route('/add_fund', methods=['POST'])
def add_fund():
    df = load_data()
    new_fund = {
        'Fund Name': request.form['fund_name'],
        'Region': request.form['region'],
        'Risk Level': int(request.form['risk_level']),
        'Management Type': request.form['management_type'],
        'Number of Assets': int(request.form['number_of_assets']),
        'Ongoing Charge (OCF)': request.form['ongoing_charge'],
        'May 2019 - Apr 2020': float(request.form['performance_2019_2020']),
        'May 2020 - Apr 2021': float(request.form['performance_2020_2021']),
        'May 2021 - Apr 2022': float(request.form['performance_2021_2022']),
        'May 2022 - Apr 2023': float(request.form['performance_2022_2023']),
        'May 2023 - Apr 2024': float(request.form['performance_2023_2024']),
    }
    df = df.append(new_fund, ignore_index=True)
    df['Performance Average'] = df[performance_cols].mean(axis=1)
    df['Overall Volatility'] = df[performance_cols].std(axis=1)
    save_data(df)
    return jsonify(df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
