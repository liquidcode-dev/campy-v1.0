require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const searchBandcamp = require('./scrapeBandcamp');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: FRONTEND_URL, 
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());

const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    process.env.SPOTIFY_ACCESS_TOKEN = response.data.access_token;
    console.log("✅ Spotify Access Token 取得成功");
  } catch (error) {
    console.error('❌ Spotifyのアクセストークン取得エラー:', error.response?.data || error.message);
  }
};

// アプリ起動時にアクセストークンを取得
getSpotifyAccessToken();

// 1時間ごとにアクセストークンを更新（Spotify のトークンは 1時間有効）
setInterval(getSpotifyAccessToken, 3600 * 1000);


// 🎵 ① Spotify認証URLを生成
app.get('/login', (req, res) => {
    console.log('🔄 Redirecting to Spotify Login');
    const scope = 'playlist-read-private';
    const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUri}`;
    
    console.log('🔗 Spotify Auth URL:', authUrl);
    res.redirect(authUrl);
  });
  

// 🎵 ② アクセストークンを取得
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET
    });
  
    try {
      const response = await axios.post(tokenUrl, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
  
      const accessToken = response.data.access_token;
  
      // 🎯 フロントエンドにリダイレクトして、トークンを渡す
      res.redirect(`${ FRONTEND_URL }/playlists?access_token=${accessToken}`);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get access token' });
    }
  });
  

// 🎵 ③ プレイリスト一覧を取得
app.get('/playlists', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const playlists = response.data.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      imageUrl: playlist.images[0]?.url || '',
    }));

    res.json(playlists);
  } catch (error) {
    console.error('❌ プレイリスト取得エラー:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'プレイリストの取得に失敗しました' });
  }
});

  

app.get('/playlist/:playlistId/tracks', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${req.params.playlistId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // 🎯 必要な情報だけを返す（曲のカバー画像も追加！）
    const tracks = response.data.tracks.items.map((item) => ({
      artist: item.track.artists[0].name,
      title: item.track.name,
      imageUrl: item.track.album.images[0]?.url || '',
    }));

    res.json({
      name: response.data.name,
      imageUrl: response.data.images[0]?.url || '',
      tracks,
    });
  } catch (error) {
    console.error('❌ 楽曲取得エラー:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: '楽曲の取得に失敗しました' });
  }
});


  // プレイリストIDを入力して楽曲を取得
  app.get('/playlist/:playlistId/public-tracks', async (req, res) => {
    const playlistId = req.params.playlistId;
  
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}` },
      });
  
      // 🎯 必要な情報だけを返す（画像情報も含める）
      const tracks = response.data.tracks.items.map((item) => ({
        artist: item.track.artists[0].name,
        title: item.track.name,
        imageUrl: item.track.album.images[0]?.url || '',
      }));
  
      res.json({
        name: response.data.name,
        imageUrl: response.data.images[0]?.url || '',
        tracks,
      });
    } catch (error) {
      console.error('❌ プレイリスト取得エラー:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: 'プレイリストの取得に失敗しました' });
    }
  });
  
  
// 🎵 ④ Bandcampで楽曲検索
app.get('/search-bandcamp', async (req, res) => {
  const { artist, title } = req.query;
  console.log("🔍 Bandcamp 検索リクエスト:", { artist, title });
  if (!artist || !title) return res.status(400).json({ error: 'Missing artist or title' });

  try {
    const link = await searchBandcamp(artist, title);
    res.json({ bandcampUrl: link });
  } catch (error) {
    console.error('❌ Bandcamp検索エラー:', error);
    res.status(500).json({ error: 'Bandcamp search failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
