from chalice import Chalice
from github import get_access_token, get_user_data

app = Chalice(app_name='server')
app.api.cors = True

app.debug = True # TODO: Remove this for production

@app.route('/')
def index():
    return {'hello': 'world!!!'}

@app.route('/github/callback', methods=['GET'])
def github_callback():
    """Authenticate the user and displays their data."""
    args = app.current_request.to_dict()
    request_token = args.get('query_params', {}).get('code')

    access_token = get_access_token(request_token)

    user_data = get_user_data(access_token)
    # return render_template('success.html', userData=user_data)
    return {'status': 'success', 'data': user_data}



# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
