from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

sec_key = os.getenv('sec_key')

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = sec_key

    from app.routes import main
    app.register_blueprint(main)

    return app