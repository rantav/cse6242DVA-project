from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    auth_code: str
    auth_token: str
    login: Optional[str]
    id: Optional[str]
    node_id: Optional[str]
    avatar_url: Optional[str]
    url: Optional[str]
    html_url: Optional[str]
    name: Optional[str]
    company: Optional[str]
    email: Optional[str]
    location: Optional[str]
    bio: Optional[str]

    def get_cookie(self) -> str:
        return self.auth_code

class Users:
    def __init__(self) -> None:
        self.database = {}

    def add(self, user: User):
        self.database[user.auth_code] = user

    def get(self, code: str) -> User:
        return self.database.get(code)

