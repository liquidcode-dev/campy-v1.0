import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Tracks from "./pages/Tracks";
import SearchResults from "./pages/SearchResults";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/tracks/:playlistId" element={<Tracks />} />
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;