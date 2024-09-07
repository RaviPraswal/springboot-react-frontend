import './App.css';
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Products from './components/Products';
import AddProducts from './components/AddProduct';
import ProductDetails from './components/ProductDetails';
import BulkUpload from './components/BulkUpload';

function App() {
  return (
    <div className="">
        <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Show Products</Link>
          </li>
          <li>
            <Link to="/add/products">Add Products</Link>
          </li>
          <li>
            <Link to="/bulk/upload/products">Bulk Upload</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add/products" element={<AddProducts />} />
        <Route path="/bulk/upload/products" element={<BulkUpload />} />

        {/* This below route is used to define a path for the product details page.
        The ":id" part is a URL parameter that dynamically changes based on the product's ID.
        When a user navigates to "/product/{id}" (e.g., "/product/1"), the ProductDetails component is rendered.
        The ProductDetails component can then use this dynamic "id" to fetch and display the relevant product information. */}
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
