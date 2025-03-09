import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Alert } from "@mui/material";

type Playlist = {
  id: string;
  name: string;
  imageUrl: string;
};

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    if (!accessToken) {
      setError("Spotifyの認証が必要です。");
      setLoading(false);
      return;
    }

    localStorage.setItem("spotify_access_token", accessToken);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/playlists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setPlaylists(response.data);
      })
      .catch(() => {
        setError("プレイリストの取得に失敗しました。");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        🎵 My Spotify Playlists
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && playlists.length === 0 && (
        <Alert severity="info">表示できるプレイリストがありません。</Alert>
      )}

      {!loading && !error && playlists.length > 0 && (
        <Grid container spacing={2} justifyContent="center" mt={3}>
          {playlists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} key={playlist.id}>
              <Card onClick={() => navigate(`/tracks/${playlist.id}`)} sx={{ cursor: "pointer", height: "100%" }}>
                <CardMedia component="img" height="160" image={playlist.imageUrl} alt={playlist.name} />
                <CardContent>
                  <Typography variant="body1" textAlign="center">
                    {playlist.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Playlists;
