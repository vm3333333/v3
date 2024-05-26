from flask import Flask, render_template, request, jsonify
import pandas as pd
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

performance_cols = ['May 2019 - Apr 2020', 'May 2020 - Apr 2021', 'May 2021 - Apr 2022', 'May 2022 - Apr 2023', 'May 2023 - Apr 2024']

def load_data():
    try:
        df = pd.read_csv('static/portfolio_data.csv')
        df[performance_cols] = df[performance_cols].apply(pd.to_numeric, errors='coerce')
        df['Performance Average'] = df[performance_cols].mean(axis=1)
        df['Overall Volatility'] = df[performance_cols].std(axis=1)
        df = df.fillna(0)  # Replace NaN with 0
        return df
    except Exception as e:
        logging.error(f"Error loading data: {e}")
        raise

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    try:
        df = load_data()
        data_dict = df.to_dict(orient='records')
        return jsonify(data_dict)
    except Exception as e:
        logging.error(f"Error in /data endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
