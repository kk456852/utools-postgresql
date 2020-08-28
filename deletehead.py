import os
import re
path = "/Users/tankuikui/Documents/personal/python/utools/public/postgresql-11.2/reference"
for filename in os.listdir(path):
    with open(os.path.join(path, filename), "r") as f:
        data = f.read()
        data = re.search(r"<h1>(?:.|\n)*", data)
        if data : 
            wf = open(os.path.join(path,filename), "w")
            wf.write(data.group())
        else : continue
    print("successfully")