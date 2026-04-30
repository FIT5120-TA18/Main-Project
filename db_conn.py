# Importing the required libraries used
import pymysql
import os
from dotenv import load_dotenv

# Loading the .env files which contains sensitive information. The file is in gitignore
load_dotenv()

# Variables for creating the connection
db_host = os.getenv('host')
db_name = os.getenv('name')
db_user = os.getenv('user')
db_pass = os.getenv('pass')

def connection():
    return pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_pass,
        database=db_name
    )