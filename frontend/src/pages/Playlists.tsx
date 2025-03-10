import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import  Grid  from "@mui/material/Grid2";
import { Card, CardMedia, CardContent, Typography, CircularProgress, Alert, styled } from "@mui/material";

const PlaylistTitle = styled(Typography)(() => ({
  fontFamily: 'Gabarito',
  fontSize: '16px',
  color: '#f5f5f5'
}));

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
      <Typography sx={{
        margin: "0 auto",
        textAlign: "center",
        fontSize: "20px"
      }}>
        Select a playlist and Click !
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && playlists.length === 0 && (
        <Alert severity="info">You have not Playlist.</Alert>
      )}

      {!loading && !error && playlists.length > 0 && (
        <Grid container spacing={2} justifyContent="center" mt={5}>
          {playlists.map((playlist) => (
            <Grid size={{xs:3, sm:3, md:3, lg:3 }} key={playlist.id}>
              <Card onClick={() => navigate(`/tracks/${playlist.id}`)} sx={{ margin: "0 auto", cursor: "pointer", width: "100%", backgroundColor: "#1f1f1f" }}>
                <CardMedia component="img" image={playlist.imageUrl} alt={playlist.name} />
                <CardContent>
                  <PlaylistTitle variant="caption">
                    {playlist.name}
                  </PlaylistTitle>
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
