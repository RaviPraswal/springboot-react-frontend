import React, { Component } from 'react';
import axios from 'axios';
import '../css/Products.css'; // Import custom CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProductDetails from './ProductDetails';
import { Link } from 'react-router-dom';

class Products extends Component {
  state = {
    searchInput:null,
    products: [],
    currentPage: 0,
    totalPages: 0,
    pageSize: 5,
    totalElements: 0,
    loading: false,
    isEmptyList: true,
    showModal: false,
    selectedProduct: null,
    onSave:null,
    showDeleteModal:false,
    deleteProduct:null,
  };

  componentDidMount() {
    this.fetchProducts(this.state.currentPage, this.state.pageSize);
  }

  fetchProducts = (page, size) => {
    this.setState({ loading: true });
    axios.get(`http://localhost:8080/api/products?page=${page}&size=${size}`)
      .then(response => {
        this.setState({
          products: response.data.content,
          totalPages: response.data.totalPages,
          currentPage: response.data.number,
          pageSize: size,
          totalElements: response.data.totalElements,
          loading: false,
          isEmptyList: false,
        });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        this.setState({ loading: false, isEmptyList: true });
      });
  };

  handlePageChange = (page) => {
    if (page >= 0 && page < this.state.totalPages) {
      this.fetchProducts(page, this.state.pageSize);
    }
  };

  handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    this.setState({ pageSize: newSize, currentPage: 0 }, () => {
      this.fetchProducts(0, newSize);
    });
  };

  handleEdit = (productId) => {
    const selectedProduct = this.state.products.find(product => product.id === productId);
    this.setState({ showModal: true, selectedProduct });
  };

  handleClose = () => {
    this.setState({ showModal: false, selectedProduct: null, showDeleteModal: false });
  };

  handleSave = async () => {
    this.setState({ loading: true });
    try {
      const { selectedProduct } = this.state;
      const response = await axios.put(`http://localhost:8080/api/update/product/${selectedProduct.id}`,selectedProduct,{
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedProduct)
      });
      if (response.status === 200) {
        this.fetchProducts(this.state.currentPage, this.state.pageSize);
        this.handleClose();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      this.setState({ error: 'Failed to update product', loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete=(productId)=>{
    const deleteProduct = this.state.products.find(product => product.id === productId);
    console.log("Clicked delete",deleteProduct);
    this.setState({ showDeleteModal: true, deleteProduct });
  }
  handleDeleteButton = async()=>{
    this.setState({ loading: true });
    try{
      const { deleteProduct } = this.state;
      const response = await axios.delete(`http://localhost:8080/api/delete/product/${deleteProduct.id}`);
      if(response.status===200){
        this.fetchProducts(this.state.currentPage, this.state.pageSize);
        this.handleClose();
      }
    }catch(error){
      console.log("Error deleting product : ",error);
    }finally{
      this.setState({ loading: false });
    }
  }

  handleInputChange = (event)=>{
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSearch=()=>{
    const searchKeyword= this.state.searchInput;
    axios.get(`http://localhost:8080/api/search/products?keyword=${searchKeyword}`).then(
      response => {
        this.setState({
          products: response.data,
        });
      }
    ).catch(error => {
      console.error('Error fetching products:', error);
    });
  }

  renderPagination = () => {
    const { currentPage, totalPages } = this.state;
    const pageNumbers = [];

    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => this.handlePageChange(i)}>
            {i + 1}
          </button>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => this.handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {pageNumbers}
          <li className={`page-item ${currentPage + 1 === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => this.handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  render() {
    const { products, pageSize, totalElements, currentPage, loading, isEmptyList, showModal, selectedProduct, showDeleteModal, deleteProduct} = this.state;
    const startEntry = currentPage * pageSize + 1;
    const endEntry = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
      <div className="container-fluid">
        {isEmptyList ? (
          <h1>No Records Available</h1>
        ) : (
          <div>
            <div class="search">
              <div class="row">
                  <div class="col-md-6">
                      <div>
                          <div class="search-2"> <i class='bx bxs-map'></i>
                              <input name="searchInput" type="text" placeholder="Search here..." value={this.state.searchKeyword} onChange={this.handleInputChange}/>
                              <button variant="link" className="ml-auto" onClick={this.handleSearch}>Search</button>
                          </div>
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
                      <button className="link-button" type="button" onClick={() => this.handleEdit(product.id)}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button className="link-button" type="button" onClick={() => this.handleDelete(product.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Edit Modal */}
            {showModal && selectedProduct && (
              <Modal show={showModal} onHide={this.handleClose}>
                <Modal.Header>
                  <Modal.Title>Editing Product ID: {selectedProduct.id}</Modal.Title>
                  <Button
                    variant="link"
                    className="ml-auto"
                    onClick={this.handleClose}
                    aria-label="Close"
                  >X
                  </Button>
                </Modal.Header>

                <Modal.Body>
                  <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                      type="text"
                      id="productName"
                      value={selectedProduct.name}
                      onChange={(e) => this.setState({ selectedProduct: { ...selectedProduct, name: e.target.value } })} 
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
                      onChange={(e) => this.setState({ selectedProduct: { ...selectedProduct, price: parseFloat(e.target.value) } })}
                      className="form-control"
                      placeholder="Enter product price"
                    />
                  </div>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                  <Button variant="primary" onClick={this.handleSave}>Save changes</Button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Delete Modal */}
            {showDeleteModal && deleteProduct && (
              <Modal show={showDeleteModal} onHide={this.handleClose}>
                <Modal.Header>
                  <Modal.Title>Deleting Product ID: {deleteProduct.id}</Modal.Title>
                  <Button
                    variant="link"
                    className="ml-auto"
                    onClick={this.handleClose}
                    aria-label="Close"
                  >X
                  </Button>
                </Modal.Header>

                <Modal.Body>
                  <div className="form-group">
                    Are You Sure You Want to Delete This Item? 
                  </div>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="primary" onClick={this.handleDeleteButton}>Yes</Button>
                  <Button variant="secondary" onClick={this.handleClose}>Cancle</Button>
                </Modal.Footer>
              </Modal>
            )}

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <select className="form-select" value={pageSize} onChange={this.handlePageSizeChange}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <p>
                Showing {startEntry} to {endEntry} of {totalElements} entries
              </p>
            </div>

            {/* Pagination Controls */}
            {this.renderPagination()}
          </div>
        )}
      </div>
    );
  }
}

export default Products;
