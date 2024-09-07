import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
    const {id} = useParams(); 
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);    
    
    useEffect(()=>{
        axios.get(`http://localhost:8080/api/products/${id}`,
            {headers: {
            'Content-Type': 'application/json',
          }}).then(response => {
            console.log(id);
            console.log(response.data);
            console.log(response);
            setProduct(response.data);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching product details:', error);
            setLoading(false);
        });
    },[id]);

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
        {/* Add more details as needed */}
      </div>
    );
  };
export default ProductDetails