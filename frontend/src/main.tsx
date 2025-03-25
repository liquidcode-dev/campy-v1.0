import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ThemeStyle from './MainTheme.tsx'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={ThemeStyle}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
