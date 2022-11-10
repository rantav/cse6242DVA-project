from flask import Flask, send_from_directory, url_for, redirect, flash, request, Response, make_response
from flask_github import GitHub
import requests
from users import Users, User
import github

app = Flask(__name__, static_url_path="/", static_folder="vite/dist")

# https://github-flask.readthedocs.io/en/latest/
gh_config = github.get_config()
app.config['GITHUB_CLIENT_ID'] = gh_config.client_id
app.config['GITHUB_CLIENT_SECRET'] = gh_config.client_secret
github_flask = GitHub(app)
users = Users()

ui = 'ui/dist/'
vite_local_server = 'http://localhost:5173/_vite/'

@app.route('/login')
def login():
    return github_flask.authorize()


@app.route('/github-callback')
@github_flask.authorized_handler
def authorized(oauth_token):
    code = request.args.get('code')
    if oauth_token is None:
        if code is None:
            # flash("Authorization failed.")
            return 'Authorization failed :-('
        oauth_token = github.get_access_token(code)
    # user = User.query.filter_by(github_access_token=oauth_token).first()
    # if user is None:
    #     user = User(oauth_token)
    #     db_session.add(user)

    # user.github_access_token = oauth_token
    # db_session.commit()
    # return redirect(next_url)
    user = User(auth_code=code, auth_token=oauth_token)
    github.add_user_data(user)
    users.add(user)
    resp = make_response('Thank you!')
    resp.set_cookie('user', user.get_cookie(), max_age=8*60*60)

    return resp



@app.route("/user")
def user():
    user_code = request.cookies.get('user')
    if user_code is None:
        return 'No user', 401
    user = users.get(user_code)
    if user is None:
        return 'No user', 401
    return user.json()

@app.route("/")
def index():
    return send_from_directory(ui, 'index.html')

@app.route("/_vite/")
def vite_root():
    return _proxy('')

@app.route("/_vite/<path:path>")
def vite(path):
    return _proxy(path)

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