from flask import Flask, jsonify, render_template
import pandas as pd

app = Flask(__name__)

# Route to get fund data from CSV
@app.route('/get_funds')
def get_funds():
    try:
        df = pd.read_csv('portfolio_data.csv')
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
