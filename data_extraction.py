# %%
### Importing data
import requests
import datetime
import os

#%%
files = os.listdir("D:/Data")

# %%
base = datetime.datetime(2022,1,1,0,0,0)
days = 31
date_list = [base + datetime.timedelta(hours=x) for x in range(days*24)]
for date in date_list:
    year = date.year
    month = date.month
    day = date.day
    hour = date.hour
    url = "https://data.gharchive.org/" + str(year) + "-" + str(month).zfill(2) + "-" + str(day).zfill(2) + "-" + str(hour) + ".json.gz"
    filename = url.split("/")[-1]
    with open(filename, "wb") as f:
        r = requests.get(url)
        f.write(r.content)
# %%
import json
import gzip
import shutil
import pandas as pd
from neo4j import GraphDatabase

for file in files[641:745]:
    full_path = "D:/Data/" + file
    with gzip.open(full_path, 'rb') as f_in:
        with open('D:/Data/testfile.json', 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)
    data = []
    actor = []
    repo = []
    commit = []
    json_data = open('D:/Data/testfile.json', encoding = "UTF-8")
    for line in json_data:
        row = json.loads(line)
        if row["type"] == "PushEvent":
            data.append(row)
            actor.append(row["actor"])
            repo.append(row["repo"])
            commitrow = {}
            commitrow["id"] = row["id"]
            commitrow["Actorid"] = row["actor"]["id"]
            commitrow["repoid"] = row["repo"]["id"]
            commitrow["commit"] = row["payload"]["head"]
            commitrow["public"] = row["public"]
            commitrow["created_at"] = row["created_at"]
            commit.append(commitrow)
    df_actor = pd.DataFrame(actor).drop_duplicates(subset="id").fillna("Not Available")
    df_actor=df_actor.replace(r'', "Not Available", regex=True)
    df_commit = pd.DataFrame(commit).drop_duplicates(subset="id")
    df_repo = pd.DataFrame(repo).drop_duplicates(subset="id").fillna("Not Available")
    df_repo=df_repo.replace(r'', "Not Available", regex=True)
    df = pd.merge(df_actor, df_commit, left_on = "id",right_on="Actorid",suffixes=["_actor",""])
    df = pd.merge(df, df_repo, left_on = "repoid",right_on="id",suffixes=["","_repo"])
    df.drop(columns=["id_actor","id_repo","gravatar_id"]).to_csv(file[:-8] + ".csv", index=False,quotechar='"')

    ddbb_neo4j = GraphDatabase.driver(url= "bolt://localhost:7687", auth=("neo4j","pwd"))
    ddbb_session = ddbb_neo4j.session()
    ddbb_session.run("""LOAD CSV WITH HEADERS FROM '{file}'  as row with row where row.id is not null
        MERGE  (n:Actor1 {{id: row.Actorid, login:row.login, display_login: row.display_login, url: row.url, avatar_url:row.avatar_url}})
        MERGE  (m:Repo1 {{id: row.repoid, name: row.name, url: row.url_repo}})
        MERGE (n) -[:TO {{dist: 1}}] -> (m)""".format(file=file))

# %%
