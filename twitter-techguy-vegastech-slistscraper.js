import urllib
import urllib2
import datetime
import time
import parsedatetime.parsedatetime as pdt
import parsedatetime.parsedatetime_consts as pdc
import httplib

import json
from pprint import pprint

c = pdc.Constants()
p = pdt.Calendar(c)


json_data=urllib2.urlopen('https://api.twitter.com/1/lists/members.json?slug=las-vegas-tech&owner_screen_name=techguy')

data = json.load(json_data)
json_data.close()

for user in data["users"]:
  twitter = user["screen_name"]
  name = user["name"]
  params = urllib.urlencode({'name': name, 'twitter': twitter})
  
  conn = httplib.HTTPConnection("localhost", 3000)
  headers = {"Content-type": "application/x-www-form-urlencoded"}
  conn.request("POST", "/person", params, headers)
  response = conn.getresponse()
  print response.status, response.reason
