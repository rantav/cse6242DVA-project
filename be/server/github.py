import requests

def get_user_data(access_token: str) -> dict:
    """Obtain the user data from github.
    Given the access token issued out by GitHub, this method should give back the
    user data
    Parameters
    ----------
    request_token: str
        A string representing the request token issued out by github
    Throws
    ------
    ValueError:
        if access_token is empty or not a string
    Returns
    -------
    user_data: dict
        A dictionary with the users data:
        {
            "avatar_url": "https://avatars.githubusercontent.com/u/60782180?v=4",
            "bio": "Founder @oryksrobotics. I design and build robots for the logistics and supply chain industry.",
            "blog": "",
            "company": "oryks robotics",
            "created_at": "2020-02-07T12:49:50Z",
            "email": null,
            "events_url": "https://api.github.com/users/lyleokoth/events{/privacy}",
            "followers": 2,
            "followers_url": "https://api.github.com/users/lyleokoth/followers",
            "following": 8,
            "following_url": "https://api.github.com/users/lyleokoth/following{/other_user}",
            "gists_url": "https://api.github.com/users/lyleokoth/gists{/gist_id}",
            "gravatar_id": "",
            "hireable": null,
            "html_url": "https://github.com/lyleokoth",
            "id": 60782180,
            "location": "Nairobi, Kenya",
            "login": "lyleokoth",
            "name": null,
            "node_id": "MDQ6VXNlcjYwNzgyMTgw",
            "organizations_url": "https://api.github.com/users/lyleokoth/orgs",
            "public_gists": 0,
            "public_repos": 79,
            "received_events_url": "https://api.github.com/users/lyleokoth/received_events",
            "repos_url": "https://api.github.com/users/lyleokoth/repos",
            "site_admin": false,
            "starred_url": "https://api.github.com/users/lyleokoth/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lyleokoth/subscriptions",
            "twitter_username": "lylethedesigner",
            "type": "User",
            "updated_at": "2022-03-21T11:00:43Z",
            "url": "https://api.github.com/users/lyleokoth"
        }
    """
    if not access_token:
        raise ValueError('The request token has to be supplied!')
    if not isinstance(access_token, str):
        raise ValueError('The request token has to be a string!')

    access_token = 'token ' + access_token
    url = 'https://api.github.com/user'
    headers = {"Authorization": access_token}

    resp = requests.get(url=url, headers=headers)

    userData = resp.json()

    return userData


def get_access_token(CLIENT_ID: str, CLIENT_SECRET: str, request_token: str) -> str:
    """Obtain the request token from github.
    Given the client id, client secret and request issued out by GitHub, this method
    should give back an access token
    Parameters
    ----------
    CLIENT_ID: str
        A string representing the client id issued out by github
    CLIENT_SECRET: str
        A string representing the client secret issued out by github
    request_token: str
        A string representing the request token issued out by github
    Throws
    ------
    ValueError:
        if CLIENT_ID or CLIENT_SECRET or request_token is empty or not a string
    Returns
    -------
    access_token: str
        A string representing the access token issued out by github
    """
    if not CLIENT_ID:
        raise ValueError('The CLIENT_ID has to be supplied!')
    if not CLIENT_SECRET:
        raise ValueError('The CLIENT_SECRET has to be supplied!')
    if not request_token:
        raise ValueError('The request token has to be supplied!')
    if not isinstance(CLIENT_ID, str):
        raise ValueError('The CLIENT_ID has to be a string!')
    if not isinstance(CLIENT_SECRET, str):
        raise ValueError('The CLIENT_SECRET has to be a string!')
    if not isinstance(request_token, str):
        raise ValueError('The request token has to be a string!')

    url = f'https://github.com/login/oauth/access_token'
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': request_token
    }
    headers = {
        'accept': 'application/json'
    }

    res = requests.post(url, data=data, headers=headers)

    data = res.json()
    access_token = data['access_token']

    return access_token
