import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App';
import { InterceptionProvider } from './context/InterceptionContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <InterceptionProvider>
      <App />
    </InterceptionProvider>
  </HashRouter>
);
