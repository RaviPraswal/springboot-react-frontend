import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Products = () => {
  const [searchInput, setSearchInput] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEmptyList, setIsEmptyList] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);

  useEffect(() => {
    fetchProducts(currentPage, pageSize, searchInput);
  }, [currentPage, pageSize, searchInput]);

  const fetchProducts = (page, size, searchInput = null) => {
    setLoading(true);
    const url = searchInput
      ? `http://localhost:8080/api/search/products?keyword=${searchInput}&page=${page}&size=${size}`
      : `http://localhost:8080/api/products?page=${page}&size=${size}`;

    axios.get(url)
      .then(response => {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.number);
        setPageSize(size);
        setTotalElements(response.data.totalElements);
        setLoading(false);
        setIsEmptyList(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
        setIsEmptyList(true);
      });
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectedPage = (event) => {
    const page = event.target.value;
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleEdit = (productId) => {
    const selectedProduct = products.find(product => product.id === productId);
    setSelectedProduct(selectedProduct);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setShowDeleteModal(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:8080/api/update/product/${selectedProduct.id}`, selectedProduct, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        fetchProducts(currentPage, pageSize, searchInput);
        handleClose();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (productId) => {
    const deleteProduct = products.find(product => product.id === productId);
    setDeleteProduct(deleteProduct);
    setShowDeleteModal(true);
  };

  const handleDeleteButton = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8080/api/delete/product/${deleteProduct.id}`);
      if (response.status === 200) {
        fetchProducts(currentPage, pageSize, searchInput);
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchInput(value);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchProducts(0, pageSize, searchInput);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    var lastPage = 0;
    for (let i = 0; i < Math.min(2, totalPages); i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i + 1}
          </button>
        </li>
      );
    }
    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {pageNumbers}
          <li>
            <input className='page-link' style={{ width: "20%" }} type='text' value={currentPage} onChange={handleSelectedPage} />
          </li>
          <li className={`page-item ${currentPage === totalPages -1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </li>
          <li className={`page-item ${currentPage + 1 === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const startEntry = currentPage * pageSize + 1;
  const endEntry = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="container-fluid">
      {isEmptyList ? (
        <h1>No Records Available</h1>
      ) : (
        <div>
          <div className="search">
            <div className="row">
              <div className="col-md-6">
                <div className="search-2">
                  <input
                    name="searchInput"
                    type="text"
                    placeholder="Search here..."
                    value={searchInput || ""}
                    onChange={handleInputChange}
                  />
                  <button variant="link" className="ml-auto" onClick={handleSearch}>Search</button>
                </div>
              </div>
            </div>
          </div>
          {loading && <div className="text-center">Loading...</div>}
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <Link to={`/product/${product.id}`}>
                      {product.name}
                    </Link>
                  </td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>
                    <button className="link-button" type="button" onClick={() => handleEdit(product.id)}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button className="link-button" type="button" onClick={() => handleDelete(product.id)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit Modal */}
          {showModal && selectedProduct && (
            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header>
                <Modal.Title>Editing Product ID: {selectedProduct.id}</Modal.Title>
                <Button variant="link" className="ml-auto" onClick={handleClose} aria-label="Close">X</Button>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    className="form-control"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productPrice">Product Price</label>
                  <input
                    type="number"
                    id="productPrice"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                    className="form-control"
                    placeholder="Enter product price"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSave}>Save changes</Button>
              </Modal.Footer>
            </Modal>
          )}

          {/* Delete Modal */}
          {showDeleteModal && deleteProduct && (
            <Modal show={showDeleteModal} onHide={handleClose}>
              <Modal.Header>
                <Modal.Title>Delete Product</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete this product: {deleteProduct.name}?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="danger" onClick={handleDeleteButton}>Delete</Button>
              </Modal.Footer>
            </Modal>
          )}
          <div>
            <h6>Showing {startEntry} to {endEntry} of {totalElements} products
            <div className="page-size">
              <span>Select Page Size: </span>
              <select value={pageSize} onChange={handlePageSizeChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            </h6>
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
