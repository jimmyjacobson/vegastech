import urllib
import urllib2
import datetime
import time
import parsedatetime.parsedatetime as pdt
import parsedatetime.parsedatetime_consts as pdc
import httplib

c = pdc.Constants()
p = pdt.Calendar(c)

from BeautifulSoup import BeautifulSoup

soup = BeautifulSoup(urllib2.urlopen('http://www.vegastech.com/events').read())

for div in soup('div', {'class' : 'entry-content'}):
  anchors = div('a')
  paragraph = div('p')
	
  name = anchors[0].string
  location = anchors[1].string
  dateString = div.contents[1].contents[1].contents[2].string
  startDate = dateString[:dateString.find(' ')]
  pos = dateString.find('-')
  if (pos > 0):
    endDate = dateString[pos+2:]
    endPos = endDate.find(' ')
    endDate = endDate[:endPos]
  else:
    endDate = startDate
  
  timeString = div.contents[1].contents[1].contents[5].string
  pos = timeString.find('-')
  startDate =  timeString[:pos-2] + ', ' + startDate
  endDate = timeString[pos+1:] + ', ' + endDate
  description = div.contents[1].contents[1].contents[13]
  description = ''.join(description.findAll(text=True))
  description = urllib.quote(description.encode('utf-8'))
  
  startDateTime = time.strftime("%Y-%m-%d %H:%M:%SZ", 
                time.gmtime(time.mktime(p.parse(startDate)[0])))
                
  endDateTime = time.strftime("%Y-%m-%d %H:%M:%SZ", 
                time.gmtime(time.mktime(p.parse(endDate)[0])))
	
  params = urllib.urlencode({'name': name, 'location': location, 'startDate': startDateTime, 'endDate': endDateTime, 'description': description})
  
  conn = httplib.HTTPConnection("localhost", 3000)
  headers = {"Content-type": "application/x-www-form-urlencoded"}
  conn.request("POST", "/event", params, headers)
  response = conn.getresponse()
  print response.status, response.reason

	# will print date and sunrise
