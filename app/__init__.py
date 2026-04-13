from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

sec_key = os.getenv('sec_key')

def create_app():
    app = Flask(__name__)

    # REQUIRED for session to work
    app.config["SECRET_KEY"] = "dev-secret-key-change-this"

    from app.routes import main
    app.register_blueprint(main)

    return app