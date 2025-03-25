import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, Box, TextField, Button, Alert, Typography } from "@mui/material";

const Description = styled(Typography)(() => ({
  fontFamily: 'Gabarito',
  textAlign: "center",
  fontSize: "1.5em"
}));

const Home = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = import.meta.env.VITE_BACKEND_URL + "/login";
  };

  const handleSearch = () => {
    const match = playlistUrl.match(/^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(\?.*)?$/);
    if (!match) {
      setError("正しいSpotifyプレイリストのURLを入力してください。");
      return;
    }
    const playlistId = match[1];
    navigate(`/tracks/${playlistId}`, { state: { fromUrlInput: true } });
  };

  return (
    <>
      <Box>
        <Description>
          Find music on bandcamp, from Spotify playlist.
        </Description>
      </Box>

      <Box sx={{
        width: 259,
        height: 75,
        margin: '30px auto',
        backgroundImage: 'url("/spotify-bandcamp.png")',
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat"
      }}>
      </Box>
      
      <Box sx={{
        width: "90%",
        margin: "50px auto",
        display: "flex",
        justifyContent: "center"
      }}>
        <Box sx={{
          width: "45%",
          margin: "5px",
          padding: "50px 25px",
          textAlign: "center",
          //border: "1px solid #272727",
          backgroundColor: "#1f1f1f"
        }}>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              Login to Spotify
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              And select your playlist.
            </Typography>
          </Box>
          <Box mt={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogin}
              sx={{
                textTransform: "none",
                margin: "0 auto"
              }}
            >Spotify login
            </Button>
          </Box>
        </Box>
        <Box sx={{
          width: "45%",
          margin: "5px",
          padding: "50px 25px",
          textAlign: "center",
          //border: "1px solid #272727",
          backgroundColor: "#1f1f1f"
        }}>

          <Box sx={{ display: "block" }}>
            <TextField
              label="Enter Spotify playlist URL"
              variant="outlined"
              fullWidth
              value={playlistUrl}
              onChange={(e) => {
                setPlaylistUrl(e.target.value);
                setError("");
              }}
              color="secondary"
              focused
              sx={{ '& .MuiInputBase-input': {
                color: '#fff'
              }}}
            />
            <Button variant="contained" color="secondary" onClick={handleSearch} sx={{ mt: 2 }}>
              GET Playlist
            </Button>
          </Box>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </>
  );
};

export default Home;
