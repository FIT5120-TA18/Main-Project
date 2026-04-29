# Flask backend, routing the pages
from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv('sec_key')

    from app.routes import main
    app.register_blueprint(main)

    return app