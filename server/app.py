#!/usr/bin/env python3
from flask import Flask
from config import app
import routes  # registers all API resources

# Root route
@app.route('/')
def index():
    return '<h1>MelodyVault Project Server</h1>'

# Run server
if __name__ == '__main__':
    app.run(port=5555, debug=True)
