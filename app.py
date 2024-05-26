from flask import Flask, request, jsonify, render_template
import pandas as pd
import sqlite3

app = Flask(__name__)

# Load CSV data into SQLite database
def load_data_to_db(csv_file):
    conn = sqlite3.connect('funds.db')
    df = pd.read_csv(csv_file)
    df.to_sql('funds', conn, if_exists='replace', index=False)
    conn.close()

# Route to load initial data
@app.route('/load_data')
def load_data():
    load_data_to_db('portfolio_data.csv')
    return 'Data loaded successfully.'

# Route to get fund data
@app.route('/get_funds')
def get_funds():
    conn = sqlite3.connect('funds.db')
    df = pd.read_sql_query("SELECT * FROM funds", conn)
    conn.close()
    return df.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True)
