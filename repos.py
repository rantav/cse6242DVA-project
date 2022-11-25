from typing import Optional, List
from pydantic import BaseModel

class Repo(BaseModel):
    id: Optional[str]
    node_id: str
    name: str
    full_name: str
    private: bool
    html_url: str
    description: Optional[str]
    fork: bool
    url: str
    language: Optional[str]
    forks_count: int
    stargazers_count: int
    watchers_count: int
    topics: List[str]
    created_at: str
    updated_at: str
#   "owner": {
#     "login": "octocat",
#     "id": 1,
#     "node_id": "MDQ6VXNlcjE=",
#     "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#     "gravatar_id": "",
#     "url": "https://api.github.com/users/octocat",
#     "html_url": "https://github.com/octocat",
#     "followers_url": "https://api.github.com/users/octocat/followers",
#     "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#     "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#     "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#     "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#     "organizations_url": "https://api.github.com/users/octocat/orgs",
#     "repos_url": "https://api.github.com/users/octocat/repos",
#     "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#     "received_events_url": "https://api.github.com/users/octocat/received_events",
#     "type": "User",
#     "site_admin": false
#   },
