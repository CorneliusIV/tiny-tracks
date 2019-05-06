const express = require('express')
const app = express()
const data = require('./data')

require('dotenv').config()

const port = parseInt(process.env.PORT, 10) || 3000

app.get('/', (req, res) => {
  data.getTinyArtistTracks().then(
    function(result) {
      res.send(result)
    },
    function(err) {
      console.log('Something went wrong!', err)
    }
  )
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
