import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import store from "./redux/store.js";


createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
)
