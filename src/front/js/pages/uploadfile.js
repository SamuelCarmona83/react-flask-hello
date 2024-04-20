import React from "react";
import { useState } from "react";

export const UploadFile = () => {

    const [file, setFile] = useState(null);
    const [serverResponse, setServerResponse] = useState('');

    const handleSubmit = async (event) => {
        if(!file) return

        const formData = new FormData();

        formData.append('image', file);
        formData.append('name', 'Jean')

        try{
            const resp = await  fetch(process.env.BACKEND_URL + '/api/image', {
                method: 'POST',
                body: formData,
            })
            const data = await resp.json()
            setServerResponse(data.url)
        }catch(err){
            setServerResponse(err.message)
        }
    };


    const handleFiles = (files) => {
        setFile(files[0])
    }

    return <>
        <div className="text-center">
            <div className="w-75 mx-auto">
                {
                    file &&
                    <img src={URL.createObjectURL(file)} alt="image-preview" style={{ maxWidth: '300px' }} />
                }
                <input type="file" onChange={(event) => handleFiles(event.target.files)}  />
            </div>
            {serverResponse}
            <button onClick={()=> handleSubmit()} className="btn btn-success" >Upload</button>
        </div>
    </>
}