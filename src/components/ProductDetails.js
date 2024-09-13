import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import '../css/product-details.css';

const ProductDetails = () => {
    const {id} = useParams(); 
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();    
    
    useEffect(()=>{
        axios.get(`http://localhost:8080/api/products/${id}`,
            {headers: {
            'Content-Type': 'application/json',
          }}).then(response => {
            setProduct(response.data);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching product details:', error);
            setLoading(false);
        });
    },[id]);

    const handleBack = ()=>{
      navigate(-1);  // Navigate to the previous page
    }


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }
    
    return (
      <div className="product-details">
        <h2>Product Details</h2>
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Dimensions:</strong> {product.dimensions}</p>
        <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
        <p><strong>Rating:</strong> {product.rating}</p>
        <p><strong>ReleaseDate:</strong> {product.releaseDate}</p>
        <p><strong>Available Stock:</strong> {product.stock}</p>
        <p><strong>Warranty:</strong> {product.warranty}</p>
        <p><strong>Weight:</strong> {product.weight}</p>

        <button className="back-button" onClick={handleBack}>
          Back
        </button>
      </div>
    );
  };
export default ProductDetails