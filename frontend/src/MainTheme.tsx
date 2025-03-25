import { createTheme } from '@mui/material/styles';

const ThemeStyle = createTheme({
    typography: {
        fontFamily: [
            'roboto',
            'Noto Sans',
            'Noto Sans JP',
            'sans-serif'
        ].join(','),
    }
});

export default ThemeStyle;