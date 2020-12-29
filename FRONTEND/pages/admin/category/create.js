import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import { useState } from 'react';
import axios from 'axios';
const ReactQuill = dynamic(()=>import ('react-quill'), {ssr:false});
import * as config from '../../../config';
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts';
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Resizer from 'react-image-file-resizer';
import 'react-quill/dist/quill.bubble.css';


const create=({user,token})=>{

  const [state,setState]=useState({
    name:'',
    error:'',
    success:'',
    image:'',
    buttonText:'Create'    
  });  
  const [content, setContent] = useState('');
  const [imageUploadText,setImageUploadText]=useState('Upload Image');

  const{name,error,image,success,buttonText}=state;

  const handleContent = event =>{
    console.log(event)
    setContent(event);
    setState({...state, error: '', success: ''})
  }
  const handleImage=(event)=>{
    let fileInput = false;
    if(event.target.files[0]) {
        fileInput = true;
    }
    if(fileInput) {
      setImageUploadText(event.target.files[0].name);
        Resizer.imageFileResizer(
            event.target.files[0],
            300,
            300,
            'JPEG',
            100,
            0,
            uri => {
                setState({...state,image:uri,success:'',error:''});
            },
            'base64'
        );
    }
  }

  const handleChange = inputId => event => {
    setState({ ...state, [inputId]: event.target.value, error: '', success: ''});
  };

  const handleSubmit=async event =>{
    event.preventDefault();
    setState({ ...state, buttonText:'Creating...' });
    try{
      const response=await axios.post(`${config.API}/category`,{name,content,image},{
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
      setState({...state,
                name:'',
                content:'',
                image:'',
                buttonText:'Created',
                success:'Category created.',
                error:''});
      setImageUploadText('Upload Image');
    }catch(error){
      setState({...state,name:'',
                image:'',
                content:'',
                buttonText:'Create', 
                success:'',
                error:error.response.data.error});
      setImageUploadText('Upload Image');
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
          {/* <textarea onChange={handleChange('content')} 
                value={content}
                className="form-control" 
                required/> */}
                <ReactQuill
                value={content}
                onChange={handleContent}
                placeholder='Write something...'
                className="pb-5 mb-3"
                theme="bubble"
                style={{border:'1px solid #666'}}>

                </ReactQuill>
        </div>

        <div className="form-group">
          <label className="btn btn-sm mt-2 btn-primary float-left">
            {imageUploadText}
            <input onChange={handleImage} 
                  type="file" 
                  accept="image/*"
                  className="form-control" 
                  hidden/>
          </label>
        </div>
        <button className="btn btn-success float-sm-right">{buttonText}</button>
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