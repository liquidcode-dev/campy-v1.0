import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import  Grid  from "@mui/material/Grid2";
import { Card, CardMedia, CardContent, Typography, CircularProgress, Alert, Button, Checkbox, FormControlLabel, Box, styled } from "@mui/material";

const TrackInfo = styled(Typography)({
  fontFamily: 'Gabarito',
  fontSize: '16px',
  color: '#f5f5f5',
  textAlign: "left"
});

type Track = {
  artist: string;
  title: string;
  imageUrl: string;
};

const Tracks = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const location = useLocation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("spotify_access_token");

    //  URL入力から遷移した場合 `public-tracks` API を使う
    const isFromUrlInput = location.state?.fromUrlInput || false;
    const apiEndpoint = isFromUrlInput
      ? `${import.meta.env.VITE_BACKEND_URL}/playlist/${playlistId}/public-tracks`
      : `${import.meta.env.VITE_BACKEND_URL}/playlist/${playlistId}/tracks`;

    const headers = isFromUrlInput ? {} : { Authorization: `Bearer ${accessToken}` };

    axios
      .get(apiEndpoint, { headers })
      .then((response) => {
        setTracks(response.data.tracks);
      })
      .catch(() => {
        setError("楽曲の取得に失敗しました。");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [playlistId, location.state]);

  const toggleTrackSelection = (trackTitle: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackTitle) ? prev.filter((t) => t !== trackTitle) : [...prev, trackTitle]
    );
  };

  const selectAllTracks = () => {
    if (selectedTracks.length === tracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(tracks.map((track) => track.title));
    }
  };

  const handleSearch = () => {
    const selectedTrackObjects = tracks
      .filter((track) => selectedTracks.includes(track.title))
      .map((track) => ({ artist: track.artist, title: track.title, imageUrl: track.imageUrl }));

    navigate(`/search-results`, { state: { tracks: selectedTrackObjects } });
  };

  return (
    <>
      <Typography sx={{
        margin: "0 auto",
        textAlign: "center",
        fontSize: "20px"
      }}>
        Select songs and Search on bandcamp !
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && tracks.length === 0 && (
        <Alert severity="info">This playlist </Alert>
      )}

      {!loading && !error && tracks.length > 0 && (
        <>
          <Box sx={{
            margin: "30px auto 0 auto",
            width: "100px",
            textAlign: "center"
          }}>
            <Button variant="text" onClick={selectAllTracks}>
              {selectedTracks.length === tracks.length ? "Cancel All" : "Select All"}
            </Button>
          </Box>

          <Grid container spacing={2} justifyContent="center" mt={3}>
            {tracks.map((track) => (
              <Grid size={{ xs:3, sm:3, md:3 }} key={track.title}>
                <Card sx={{ margin: "0 auto", width: "100%", backgroundColor: "#1f1f1f" }}>
                  <CardMedia component="img" image={track.imageUrl} alt={track.title} />
                  <CardContent sx={{ textAlign: "center" }}>
                    <TrackInfo>{track.title}</TrackInfo>
                    <TrackInfo>{track.artist}</TrackInfo>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ selectedTracks.includes(track.title) }
                          onChange={() => toggleTrackSelection(track.title)}
                          color="primary"
                        />
                      }
                      label="Select"
                      sx={{ '& .MuiFormControlLabel-label': {
                        color: '#888',
                        fontSize: "14px"
                      }}}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{
            margin: "50px auto 0 auto",
            width: "200px",
            textAlign: "center"
          }}>
            <Button
              variant="contained"
              color="secondary"
              disabled={selectedTracks.length === 0}
              onClick={handleSearch}
              sx={{ textTransform: "none" }}
            >Search on bandcamp
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default Tracks;
