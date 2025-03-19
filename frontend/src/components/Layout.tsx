import { Container, Box } from "@mui/material";
import HeaderComponent from "./Header";
import FooterComponent from "./Footer";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        width: '1024px',
        margin: "0 auto"
      }}
    >
      {/* header */}
      <HeaderComponent />

      {/* main contents */}
      <Container sx={{ mt: 4, minHeight: "80vh" }}>
        {children}
      </Container>

      {/* footer */}
      <FooterComponent />
    </Box>
  );
};

export default Layout;
