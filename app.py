from flask import Flask, render_template, jsonify, request
import pandas as pd

app = Flask(__name__)

def load_data():
    # Load the CSV file
    df = pd.read_csv('portfolio_data.csv')

    # Convert performance columns to numeric
    performance_cols = [
        'Performance (May 2019 - Apr 2020)', 'Performance (May 2020 - Apr 2021)',
        'Performance (May 2021 - Apr 2022)', 'Performance (May 2022 - Apr 2023)',
        'Performance (May 2023 - Apr 2024)'
    ]
    df[performance_cols] = df[performance_cols].apply(pd.to_numeric, errors='coerce')

    # Calculate average performance
    df['Performance Average'] = df[performance_cols].mean(axis=1)

    # Calculate overall volatility (standard deviation of performances)
    df['Overall Volatility'] = df[performance_cols].std(axis=1)

    return df

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    df = load_data()
    data = df.to_dict(orient='records')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
