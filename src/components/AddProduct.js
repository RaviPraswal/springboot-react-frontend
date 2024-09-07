import React, { Component } from 'react';
import '../css/add-product.css';

class AddProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      productPrice: ''
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { productName, productPrice } = this.state;

    const product = {
      name: productName,
      price: parseFloat(productPrice)
    };

    fetch('http://localhost:8080/api/add/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Check if there's a body before parsing
        return response.text().then(text => text ? JSON.parse(text) : {});
      })
      .then(data => {
        console.log('Product added:', data);
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  render() {
    return (
      <div className="container-fluid">
        <h1>Add Products here</h1>
        <form className="product-form" onSubmit={this.handleSubmit}>
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            placeholder="Enter product name"
            value={this.state.productName}
            onChange={this.handleInputChange}
          />

          <label htmlFor="productPrice">Product Price</label>
          <input
            type="text"
            id="productPrice"
            name="productPrice"
            placeholder="Enter product price"
            value={this.state.productPrice}
            onChange={this.handleInputChange}
          />

          <button type="submit">Add Product</button>
        </form>
      </div>
    );
  }
}

export default AddProducts;
