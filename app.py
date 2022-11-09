from flask import Flask, send_from_directory, url_for, redirect, flash, request, Response
from flask_github import GitHub
import requests
import os

app = Flask(__name__, static_url_path="/", static_folder="vite/dist")

# https://github-flask.readthedocs.io/en/latest/
app.config['GITHUB_CLIENT_ID'] = os.getenv('GITHUB_CLIENT_ID')
app.config['GITHUB_CLIENT_SECRET'] = os.getenv('GITHUB_CLIENT_SECRET')
github = GitHub(app)

ui = 'ui/dist/'
vite_local_server = 'http://localhost:5173/_vite/'

@app.route('/login')
def login():
    return github.authorize()


@app.route('/env')
def env():
    # return os.getenv('XXX')
    return app.config['GITHUB_CLIENT_ID']



@app.route('/github-callback')
@github.authorized_handler
def authorized(oauth_token):
    next_url = request.args.get('next') or url_for('index')
    if oauth_token is None:
        flash("Authorization failed.")
        return redirect(next_url)

    # user = User.query.filter_by(github_access_token=oauth_token).first()
    # if user is None:
    #     user = User(oauth_token)
    #     db_session.add(user)

    # user.github_access_token = oauth_token
    # db_session.commit()
    return redirect(next_url)


@app.route("/")
def index():
    # return render_template('index.html')
#     return _proxy()
    # return send_from_directory(ui_dev, 'index.html')
    # return "Hello World"
    return send_from_directory(ui, 'index.html')

@app.route("/_vite/")
def vite_root():
    return _proxy('')

@app.route("/_vite/<path:path>")
def vite(path):
    return _proxy(path)

# @app.route("/<path:path>")
# def any(path):
#     return _proxy()

# @app.route("/src/<path:path>")
# def src(path):
#     return send_from_directory(ui + 'src', path)

@app.route("/assets/<path:path>")
def assets(path):
    return send_from_directory(ui + 'assets', path)


def _proxy(path):
    url = vite_local_server + path
    resp = requests.request(
        method=request.method,
        url=url,
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False)

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]

    response = Response(resp.content, resp.status_code, headers)
    return response


if __name__ == "__main__":
    app.run(debug=True, port=5000)