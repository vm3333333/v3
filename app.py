import pandas as pd
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Global Dataframe
df = pd.read_csv('portfolio_data.csv')

# Check if 'id' column exists, if not, create it
if 'id' not in df.columns:
    df['id'] = range(1, len(df) + 1)  # Generate sequential IDs starting from 1

# Load and Save Favorites to a File
def load_favorites():
    try:
        favorites = pd.read_csv('favorites.csv')['id'].tolist()
    except FileNotFoundError:
        favorites = []
    return favorites

def save_favorites(favorites):
    pd.DataFrame(favorites, columns=['id']).to_csv('favorites.csv', index=False)

# Get Favorites Initially
favorites = load_favorites()
df['favorite'] = df['id'].isin(favorites)


# Calculate average performance & volatility
performance_cols = [col for col in df.columns if 'Performance' in col]
df['Performance Average'] = df[performance_cols].mean(axis=1)
df['Overall Volatility'] = df[performance_cols].std(axis=1)


@app.route('/')
def index():
    # Prepare data for rendering (include filtering, sorting, etc.)
    data = df.to_dict(orient='records')

    # Get filter values from query parameters
    volatility_filter = request.args.get('volatility', type=float)
    performance_filter = request.args.get('performance', type=float)
    show_favorites = request.args.get('favorites', type=str) == 'true'

    # Apply filters
    if not pd.isna(volatility_filter):
        data = [fund for fund in data if fund['Overall Volatility'] >= volatility_filter]
    if not pd.isna(performance_filter):
        data = [fund for fund in data if fund['Performance Average'] >= performance_filter]
    if show_favorites:
        data = [fund for fund in data if fund['favorite']]

    # Sort by Performance Average in descending order (optional)
    data = sorted(data, key=lambda x: x['Performance Average'], reverse=True)

    return render_template('index.html', data=data)


@app.route('/update', methods=['POST', 'DELETE'])
def update_fund():
    global df, favorites
    if request.method == 'POST':
        data = request.get_json()

        if isinstance(data, list):  # Bulk update
            for fund_data in data:
                update_or_add_fund(fund_data)
        else:  # Single fund update
            update_or_add_fund(data)

    elif request.method == 'DELETE':
        fund_id = request.get_json()['id']
        df = df[df['id'] != fund_id]
        if fund_id in favorites:
            favorites.remove(fund_id)
        save_favorites(favorites)

    # Recalculate performance averages and volatilities after updating df
    df['Performance Average'] = df[performance_cols].mean(axis=1)
    df['Overall Volatility'] = df[performance_cols].std(axis=1)

    # Save updated dataframe to CSV (optional)
    df.to_csv('portfolio_data.csv', index=False)

    return jsonify(success=True, data=df.to_dict(orient='records'))

#Correct indentation
def update_or_add_fund(fund_data):
    global df, favorites
    if 'id' in fund_data and int(fund_data['id']) in df['id'].values:  # Update existing fund
        df.loc[df['id'] == int(fund_data['id']), fund_data.keys()] = fund_data.values()
    else:  # Add new fund
        fund_data['id'] = df['id'].max() + 1  # Assign new ID
        df = df.append(fund_data, ignore_index=True)
        
    if 'favorite' in fund_data and fund_data['favorite']:
        if fund_data['id'] not in favorites:
            favorites.append(fund_data['id'])
    elif 'favorite' in fund_data and not fund_data['favorite'] and fund_data['id'] in favorites:
        favorites.remove(fund_data['id'])

    save_favorites(favorites)
#Correct indentation   
if __name__ == '__main__':
    app.run(debug=True) 
