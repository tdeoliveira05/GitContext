const metascraper = require('metascraper')([
    require('metascraper-author'),
    require('metascraper-date'),
    require('metascraper-description'),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-clearbit-logo')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
])

const got = require('got')

const targetUrl = 'https://www.cnn.com/politics/live-news/kavanaugh-fbi-investigation-oct-18/h_f9f0d55b5fb35b5d7b7ae1bd5e17ec11'

;(async () => {
  const { body: html, url } = await got(targetUrl)
  const metadata = await metascraper({ html, url })
  console.log(metadata)
})()