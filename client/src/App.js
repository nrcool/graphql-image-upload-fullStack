
import React, { useState } from 'react';
import { useMutation, gql } from "@apollo/client";

const SINGLE_UPLOAD = gql`
  mutation($file: Upload!,$storage:String!) {
    singleUpload(file: $file, storage:$storage) {
      filename
      imageUrl
    }
  }
`;
function App() {
 
    const [imageUrl,setImageUrl]=useState(null)
    const [storage,setStorage]=useState("s3")
    const [singleUpload, {loading, error }] = useMutation(SINGLE_UPLOAD);

   const upload=(e)=>{
     e.preventDefault()
     console.log(e.target.file.files[0])
     singleUpload({variables:{file:e.target.file.files[0], storage:storage},onCompleted:(data)=>{
       console.log("uploaded successfully ..",data)
       setImageUrl(data.singleUpload.imageUrl)
     }}) 
   }
  if (error) return <div>{JSON.stringify(error, null, 2)}</div>; 
  return (
    <div>
      <h2>Image Upload</h2>
      <div><h3>upload image on</h3>
      <select onChange={(e)=>setStorage(e.target.value)}>
        <option value="s3">S3</option>
        <option value="local_server">local server</option>
        <option value="mongodb">mongoDB</option>
      </select><br /><br />
      </div>
      
      <form onSubmit={upload}>
      <input type="file"  name="file" />
      <input type="submit" value="upload image"/>
      </form>
      <h2>Preview</h2>
      <div style={{border:"2px solid",width:"300px",height:"300px",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"30px"}}>
        {loading ?<div>Loading...</div> : <img src={imageUrl} alt="" width="300" height="300"  />  }
     
      </div>
      
    </div>
  );
}

export default App;