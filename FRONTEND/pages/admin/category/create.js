import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import { useState,useEffect } from 'react';
import axios from 'axios';
import * as config from '../../../config';
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts';
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const create=({user,token})=>{

  const [state,setState]=useState({
    name:'',
    content:'',
    error:'',
    success:'',
    formData:process.browser && new FormData(),
    buttonText:'Create',
    imageUploadText:'Upload Image'
  });

  const{name,content,error,success,formData,buttonText,imageUploadText}=state;

  const handleChange = inputId => event => {
    const value = inputId === 'image' ? event.target.files[0] : event.target.value;
    const imageName = inputId === 'image' ? event.target.files[0].name : 'Upload image';
    formData.set(inputId,value);

    setState({ ...state, [inputId]: value, error: '', success: '',imageUploadText:imageName });
  };

  const handleSubmit=async event =>{
    event.preventDefault();
    setState({ ...state, buttonText:'Creating...' });
    try{
      const response=await axios.post(`${config.API}/category`,formData,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
      setState({...state,
                name:'',
                content:'',
                formData:'',
                buttonText:'Created',
                success:'Category created.',
                error:'', 
                imageUploadText:'Upload image'});
    }catch(error){
      console.log('CATEGORY CREATE ERROR',error);
      setState({...state,name:'',
                formData:'',
                buttonText:'Create', 
                success:'',
                error:error.response.data.error});
    }
  }

  const createCategoryForm=()=>{
    return (<form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input onChange={handleChange('name')} 
              value={name}
              type="text" 
              className="form-control" 
              required/>
        </div>

        <div className="form-group">
          <label className="text-muted">Content</label>
          <textarea onChange={handleChange('content')} 
                value={content}
                className="form-control" 
                required/>
        </div>

        <div className="form-group">
          <label className="btn btn-outline-primary">
            {imageUploadText}
            <input onChange={handleChange('image')} 
                  type="file" 
                  accept="image/*"
                  className="form-control" 
                  hidden/>
          </label>
        </div>
        <div >
          <button className="btn btn-success float-sm-right">{buttonText}</button>
        </div>
    </form>);
  }

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <div className="card">
          <h5 className="card-header">CREATE CATEGORY <FontAwesomeIcon className="float-sm-right" icon={faListAlt}/></h5>  
          <div className="card-body">
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {createCategoryForm()}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withAdmin(create);