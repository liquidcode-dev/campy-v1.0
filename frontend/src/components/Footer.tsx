import { Box, Typography, styled } from '@mui/material';


const Footer = styled(Box)(({ theme }) => ({
  display: 'flex',
  margin: "0 auto",
  alignItems: 'center',
  justifyContent: "center",
  padding: theme.spacing(2)
}));

const FooterComponent = () => {
  return (
    <Footer>
      <Typography sx={{
        marginTop: "100px",
        color: "#6c6c6c",
        fontSize: "0.8em"
      }}>© Campy</Typography>
    </Footer>
  );
}

export default FooterComponent;