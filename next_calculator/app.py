from flask import Flask 
# from flask_cors import CORS


app = Flask(__name__) 
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route('/api/hello') 
def index(): return 'Hello from Flask!' 

if __name__ == '__main__': 
    app.run(debug=True) 