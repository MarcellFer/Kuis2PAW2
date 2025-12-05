// import React mengimpor modul React dari pustaka react.
// authmiddleware untuk login baru bisa dihapus
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
// { Suspense } mengimpor komponen Suspense dari pustaka React. Suspense digunakan untuk menunda rendering komponen hingga data atau kode yang diperlukan telah siap.
import React, { Suspense } from "react";

// Biasanya, Suspense digunakan bersama React.lazy() untuk mendukung pemuatan (loading) komponen secara dinamis (lazy loading).
// Import Component
const Home = React.lazy(() => import("./components/Home"));
const MenuList = React.lazy(() => import("./components/Menu/List"));
const MenuCreate = React.lazy(() => import("./components/Menu/Create"));
const KategoriList = React.lazy(() => import("./components/Kategori/List"));
const KategoriCreate = React.lazy(() => import("./components/Kategori/Create"));


function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
      Navbar
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className="nav-link active" aria-current="page" to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/menu">
            Menu
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/kategori">
            Kategori
          </NavLink>
        </li>
      </ul>
    </div>
  </div>
</nav>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuList />} />
          <Route path="/menu/create" element={<MenuCreate />} />
          <Route path="/kategori" element={<KategoriList />} />
          <Route path="/kategori/create" element={<KategoriCreate />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;