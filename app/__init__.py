# Flask backend, routing the pages
from flask import Flask
import os
from dotenv import load_dotenv
from app.routes import main
from app.api.locations import api

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv('sec_key')

    app.register_blueprint(main)
    app.register_blueprint(api)

    return app