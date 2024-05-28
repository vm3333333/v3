from flask import Flask, jsonify, send_from_directory
import pandas as pd

app = Flask(__name__)

def load_and_validate_data(file_path):
    # Load the data
    data = pd.read_csv(file_path)
    
    # Strip '%' and convert to float
    performance_columns = [col for col in data.columns if 'May' in col]
    for column in performance_columns:
        data[column] = data[column].str.rstrip('%').astype(float) / 100
    
    # Validate data: handle missing values
    numeric_columns = data.select_dtypes(include=['float64', 'int64']).columns
    data[numeric_columns] = data[numeric_columns].apply(lambda x: x.fillna(x.mean()))
    
    object_columns = data.select_dtypes(include=['object']).columns
    data[object_columns] = data[object_columns].apply(lambda x: x.fillna('N/A'))
    
    # Calculate metrics
    data['Average Performance'] = data[performance_columns].mean(axis=1)
    data['Volatility'] = data[performance_columns].std(axis=1)
    
    return data

@app.route('/load-data', methods=['GET'])
def load_data():
    file_path = 'backend/data/portfolio_data.csv'  # Updated file path
    data = load_and_validate_data(file_path)
    return jsonify(data.to_dict(orient='records'))

@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    app.run(debug=True)

