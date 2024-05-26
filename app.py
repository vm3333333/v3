from flask import Flask, jsonify, render_template
import pandas as pd
import sqlite3

app = Flask(__name__)

# Load CSV data into SQLite database
def load_data_to_db(csv_file):
    try:
        print("Loading data from CSV file...")
        conn = sqlite3.connect('funds.db')
        df = pd.read_csv(csv_file)
        print(f"CSV Data: {df.head()}")  # Print first few rows of the dataframe
        df.to_sql('funds', conn, if_exists='replace', index=False)
        conn.close()
        print("Data loaded successfully into the database.")
    except Exception as e:
        print(f"Error loading data: {e}")

# Route to load initial data
@app.route('/load_data')
def load_data():
    load_data_to_db('portfolio_data.csv')
    return 'Data loaded successfully.'

# Route to get fund data
@app.route('/get_funds')
def get_funds():
    try:
        print("Fetching data from the database...")
        conn = sqlite3.connect('funds.db')
        df = pd.read_sql_query("SELECT * FROM funds", conn)
        conn.close()
        print("Data fetched successfully.")
        return df.to_json(orient='records')
    except Exception as e:
        print(f"Error fetching data: {e}")
        return jsonify({"error": str(e)}), 500

# Route to render the main page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
