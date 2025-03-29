import { BrowserRouter, Routers, Route } from 'react-router-dom';
import Header from './components/Header';
import Warehouse from './components/Warehouse';
import Footer from './components/Footer/Footer';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routers>
          <main>
            <Route path="/" element={<Warehouse />} />
          </main>
        </Routers>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
