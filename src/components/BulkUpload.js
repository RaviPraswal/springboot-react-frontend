import React, { useState } from 'react';
import axios from 'axios';

const BulkUpload =()=>{
    const [uploadProgress, setUploadProgress] = useState(0);
    const handleSubmit =(event)=> {
        event.preventDefault();
        const formData = new FormData(event.target);
        axios.post(`http://localhost:8080/api/upload/file`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            },
            onUploadProgress:(progressEvent) => {
                const progressCompleted = Math.round((progressEvent.loaded*100)/progressEvent.total);
                setUploadProgress(progressCompleted);
            }
        })
        .then(response=>console.log(response.data))
        .catch(error=>console.error("Error Uploading File: ",error));
    };

    return(
        <div>
            <form className="bulk-upload-form" onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
                <label htmlFor="fileName">Enter File Name</label>
                <input type='text' id="fileName" name="fileName"/>
                <label htmlFor="file">Select File for Bulk Uploading</label>
                <input type='file' id="file" name="file"/>
                <button type='submit'>Bulk Upload</button>
            </form>
            {uploadProgress > 0 && (
                <div>
                    <progress value={uploadProgress} max="100" />
                    <span>{uploadProgress}%</span>
                </div>
            )}
        </div>
    );
};
export default BulkUpload