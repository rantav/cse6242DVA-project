import logging
import os
import requests
from pydantic import BaseModel
from users import User

class Config(BaseModel):
    client_id: str
    client_secret: str


def get_config() -> Config:
    return Config(client_id=os.getenv('GITHUB_CLIENT_ID'), client_secret=os.getenv('GITHUB_CLIENT_SECRET'))

def add_user_data(user: User):
    user_data = get_current_user_data(user.auth_token)
    user.login = user_data['login']
    user.id = user_data['id']
    user.node_id = user_data['node_id']
    user.avatar_url = user_data['avatar_url']
    user.url = user_data['url']
    user.html_url = user_data['html_url']
    user.name = user_data['name']
    user.company = user_data['company']
    user.email = user_data['email']
    user.location = user_data['location']
    user.bio = user_data['bio']


def get_current_user_data(access_token: str) -> User:
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

    user_data = resp.json()

    return user_data

def get_user(user_login: str, access_token: str) -> User:
    headers = None
    if access_token is not None:
        access_token = 'token ' + access_token
        headers = {"Authorization": access_token}

    url = f'https://api.github.com/users/{user_login}'
    resp = requests.get(url=url, headers=headers)

    user_data = resp.json()
    user = User(
        login = user_data['login'],
        id = user_data['id'],
        node_id = user_data['node_id'],
        avatar_url = user_data['avatar_url'],
        url = user_data['url'],
        html_url = user_data['html_url'],
        name = user_data['name'],
        company = user_data['company'],
        email = user_data['email'],
        location = user_data['location'],
        bio = user_data['bio'])

    return user


def get_access_token(request_token: str, log: logging.Logger = None) -> str:
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
    config = get_config()
    if not request_token:
        raise ValueError('The request token has to be supplied!')
    if not isinstance(request_token, str):
        raise ValueError('The request token has to be a string!')

    url = 'https://github.com/login/oauth/access_token'
    data = {
        'client_id': config.client_id,
        'client_secret': config.client_secret,
        'code': request_token,
    }
    headers = {
        'accept': 'application/json'
    }

    res = requests.post(url, data=data, headers=headers)

    data = res.json()

    if data.get('error'):
        log.error(data)
        raise Exception(data.get('error'))

    access_token = data['access_token']

    return access_token