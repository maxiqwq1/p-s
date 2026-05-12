from flask import Flask
from flask_cors import CORS
from routes.articulos import articulos_bp
from routes.stats import stats_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(articulos_bp, url_prefix="/api")
app.register_blueprint(stats_bp, url_prefix="/api")

@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)