try:
  import settings_local as settings
except:
  import settings
import webapp2
import logging
import urllib2
import json
import os

class ScriptPage(webapp2.RequestHandler):
  def get(self):
    self.response.headers.add('Content-Type', 'text/javascript; charset=utf-8');
    url = 'https://www.googleapis.com/plus/v1/people/me?access_token=' + self.request.get('token')

    scripts = [
      'modules/lowerthird.js',
      'modules/soundboard.js',
      'modules/volumecontrol.js',
      'modules/memeface.js',
      'modules/commenttracker.js',
      'hangouttoolbox.js'
      ]

    #try:
    response = urllib2.urlopen(url)

    data = json.loads(response.read())

    if 'id' in data:
      retval = ''
      if data['id'] == '117596712775912423303' or data['id'] == '108751342867466333780' or data['id'] == '112336147904981294875' or data['id'] == '104514437420477125478':
        scripts = [
          'modules/lowerthird.js',
          'modules/soundboard.js',
          'modules/volumecontrol.js',
          'modules/memeface.js',
          'modules/commenttracker.js',
          'hangouttoolbox.js'
          ]

      for script in scripts:
        file = open(os.path.dirname(__file__) + '/'+ script)
        retval += '\n' + ''.join(file.readlines())

      self.response.write(retval)
    #except:
    #  pass


app = webapp2.WSGIApplication([
                              ('^/getScript$', ScriptPage),
                              ],
                              debug=True)
