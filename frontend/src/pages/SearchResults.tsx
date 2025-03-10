import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import  Grid  from "@mui/material/Grid2";
import { Card, CardMedia, CardContent, Typography, CircularProgress, Alert, Button, styled } from "@mui/material";

const TrackInfo = styled(Typography)(() => ({
  fontFamily: 'Gabarito',
  fontSize: '16px',
  color: '#f5f5f5',
  textAlign: "left"
}));

type SearchResult = {
  title: string;
  artist: string;
  imageUrl: string;
  bandcampUrl: string | null;
  isSearching: boolean;
};

type LocationState = {
  tracks: SearchResult[];
};

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const selectedTracks = (location.state as LocationState)?.tracks || [];
    if (selectedTracks.length === 0) {
      setError("Select the song you want to search.");
      return;
    }

    setResults(selectedTracks.map((track) => ({
      ...track,
      bandcampUrl: null,
      isSearching: true,
    })));

    selectedTracks.forEach(({ artist, title }: SearchResult) => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/search-bandcamp`, { params: { artist, title } })
        .then((response) => {
          setResults((prevResults) =>
            prevResults.map((result) =>
              result.title === title
                ? { ...result, bandcampUrl: response.data.bandcampUrl || null, isSearching: false }
                : result
            )
          );
        })
        .catch(() => {
          setResults((prevResults) =>
            prevResults.map((result) =>
              result.title === title ? { ...result, isSearching: false } : result
            )
          );
        });
    });
  }, [location.state]);

  return (
    <>
      <Typography sx={{
        margin: "0 auto",
        textAlign: "center",
        fontSize: "20px"
      }}>
        Go bandcamp by search result !
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2} justifyContent="center" mt={5}>
        {results.map((result, index) => (
          <Grid size={{ xs:12, sm:6, md:4 }} key={index}>
            <Card sx={{ width: "200px", backgroundColor: "#1f1f1f" }}>
              <CardMedia component="img" height="200" image={result.imageUrl} alt={result.title} />
              <CardContent sx={{ textAlign: "center" }}>
              <TrackInfo>{result.title}</TrackInfo>
              <TrackInfo>{result.artist}</TrackInfo>

                {result.isSearching ? (
                  <CircularProgress size={24} sx={{ mt: 2 }} />
                ) : result.bandcampUrl ? (
                  <Button variant="contained" color="primary" href={result.bandcampUrl} target="_blank" sx={{ mt: 2 }}>
                    Go bandcamp!
                  </Button>
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>Not found.</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SearchResults;
