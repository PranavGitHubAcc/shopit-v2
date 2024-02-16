import "./App.css";

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Home from "./components/Home.jsx";
import ProductDetails from "./components/product/ProductDetails.jsx";

import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import { Toaster} from 'react-hot-toast'
function App() {
  return (
      <Router>
          <div className="App">
            <Toaster position="top-center"/>
              <Header />
            
              <div className="container">
                  <Routes>
                      <Route path="/" element={<Home />}></Route>
                      <Route path="/product/:id" element={<ProductDetails/>}></Route>
                  </Routes>
              </div>

              <Footer />
          </div>
      </Router>
  );
}

export default App;
