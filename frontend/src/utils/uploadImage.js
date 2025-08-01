import {API_PATHS} from "./apiPath.js";
import axiosInstance from "./axiosInstance.js";

const uploadImage=async(imageFile)=>{
    const formData = new FormData();
    formData.append("image",imageFile);

    try{
        const response=await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;

    }catch(error){
        console.error("Error uploading image:",error);
        throw error;
    }
}

export default uploadImage;