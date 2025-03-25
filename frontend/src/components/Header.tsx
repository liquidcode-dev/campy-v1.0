import { Box, Typography, styled } from '@mui/material';
import AlbumIcon from '@mui/icons-material/Album';

const Header = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
    alignItems: 'center'
}));

const Sitetitle = styled(Typography)(() => ({
    fontFamily: 'Gabarito',
    fontSize: '26px',
    paddingLeft: '5px'
}));

const HeaderComponent = () => {
  return (
    <Header>
      <AlbumIcon />
      <Sitetitle>Campy</Sitetitle>
    </Header>
  );
}

export default HeaderComponent;