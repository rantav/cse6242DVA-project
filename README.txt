DESCRIPTION
This project collects and analyses GitHub user activity.
We collect the logs of actions performed on GitHub (such as push events) and create an implicit
social network from them, whereby an edge (connection) is defined as users' co-activity on the same repo.

In CODE directory you'd find the frontend (ui) comprising of a React and D3 app,
the backend (be) comprising of a Python Flask app serving the data from the Neo4J database,
or GitHub's API.

Using the app:
After opening the web UI, you see the shortest path for two default users.
You may now click on any of the nodes in the graph in order to expand it (see more neighbors) and its
details in the side pane.
You may keep on clicking other nodes to expand them.
You may also select two other users in order to view the shortest GitHub path between them.
Keep in mind that the data collected is only for a short term of time due to its size therefore
not all GitHub users are found in the database.
Click the Help section at the bottom of the page for more options.

GitHub login is optional. If logged in, we use your GitHub token in order to get more API calls,
these are used for the sake of populating the sidebar. If you keep on clicking nodes, each click
results in one API call to GitHub and when not logged in the quota runs out quickly.

INSTALLATION
No need to install. Visit our online web demo at https://gh-explorer-081.herokuapp.com/

If you do want to run it locally (no need to, use the online demo) then you can install using `make install`
Prerequisite to that are Python 3 (named `python3`) and Node.js v18.9.0 named `node`.
Another requirement is to install the heroku CLI (https://devcenter.heroku.com/articles/heroku-cli)
(`brew tap heroku/brew && brew install heroku`)

EXECUTION
No need to execute. Visit our online web demo at https://gh-explorer-081.herokuapp.com/
If you do want to run it locally (no need to) then you can run using `make ui` in one terminal window
and `make be` in another terminal window. Then open http://127.0.0.1:5001/_vite/

DEMO VIDEO
How to use and install https://youtu.be/7K_IUaUdJ7c