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

# Establishing connection with the database
connection = pymysql.connect(host=db_host, database=db_name, user=db_user, password=db_pass)
print("Connected to the database")

# Creating a cursor to test the connection. For testing, just printed the version
cursor = connection.cursor()
cursor.execute('SELECT version()')
db_version = cursor.fetchone()
print(db_version)

# When not in use, close the connection
cursor.close()