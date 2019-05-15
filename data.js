const { google } = require('googleapis')
const SpotifyWebApi = require('spotify-web-api-node')

require('dotenv').config()

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'https://koolexposure.com'
})

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

// Get artist's name from Youtube title and normalize it
function getTitle(item) {
  const videoTitle = item.snippet.title
  // The titles normally follow one of the two formats
  // Artist Name : Description
  // Artist Name - Description
  // Artist Name (Description)
  // Artist Name NPR Descrition
  // Let's break the title into two parts at one of the special characters
  const artistString = videoTitle.split(/[-(:\/-]/)[0]
  // Sorry NPR but this if you are included in the Title split there as well
  const artist = artistString.split('NPR')[0]
  // Strip white space and set to lower
  const artistName = artist.trim().toLowerCase()
  // TODO: This still still kind of hacky and doesn't cover all cases
  // Ex: Solve for ampersands and 'and'
  return artistName
}

// The main function to make calls to Youtube and Spotify
async function getTinyArtistTracks() {
  // the first query will return data with an etag
  const response = await getPlaylistData()
  const results = response.data.items.map(getTitle)
  // Create a set to make sure everything is unique and back to an array because we need it iterable
  const artists = Array.from(new Set(results))
  const artistData = await getArtistID(artists)
  return artistData
}

// Get Youtube playlist data
async function getPlaylistData() {
  const res = await youtube.playlistItems.list({
    part: 'id,snippet',
    maxResults: 25,
    playlistId: process.env.PLAYLIST_ID
  })
  return res
}

async function buildArtistData(artist) {
  let artistSong = new Object()
  // Get Access Token
  const data = await spotifyApi.clientCredentialsGrant()
  spotifyApi.setAccessToken(data.body['access_token'])
  // Get artist data mainly for their ID
  const artistData = await spotifyApi.searchArtists(artist)
  // TODO These can return undefined. Add a safety check
  try {
    const artistID = artistData.body.artists.items[0].id
    const tracksData = await spotifyApi.getArtistTopTracks(artistID, 'GB')
    artistSong.name = tracksData.body.tracks[0].artists[0].name
    artistSong.songName = tracksData.body.tracks[0].name
    artistSong.link = tracksData.body.tracks[0].href
  } catch (err) {
    console.log('error', err)
  }
  return artistSong
}

// Get Track data from Spotify and build Artist/Track Object
async function getArtistID(artists) {
  let tinyTracks = await Promise.all(artists.map(buildArtistData))
  // Remove empty objects from bug in buildArtistData
  tinyTracks = tinyTracks.filter(value => Object.keys(value).length !== 0)
  return tinyTracks
}

module.exports.getTinyArtistTracks = getTinyArtistTracks
module.exports.getTitle = getTitle
