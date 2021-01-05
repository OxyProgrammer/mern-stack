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


const update=({oldCategory, token})=>{

  const [state,setState]=useState({
    name:oldCategory.name,
    error:'',
    success:'',
    buttonText: 'Update',
    image:'',
    imagePreview:oldCategory.image.url    
  });  
  const [content, setContent] = useState(oldCategory.content);
  const [imageUploadText,setImageUploadText]=useState('Update Image');

  const{name,error,image,success,buttonText,imagePreview}=state;

  const handleContent = event =>{
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
    setState({ ...state, buttonText:'Updating...' });
    try{
      const response=await axios.put(`${config.API}/category/${oldCategory.slug}`,{name,content,image},{
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
      setContent('');
      setState({...state,
                name:'',
                image:'',
                buttonText:'Updated',
                success:'Category updated.',
                imagePreview:'',
                error:''});
      setImageUploadText('Upload Image');
    }catch(error){
      setState({...state,name:'',
                image:'',
                buttonText:'Update', 
                success:'',
                error:error.response.data.error});
      setImageUploadText('Upload Image');
    }
  }

  const updateCategoryForm=()=>{
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
            {imageUploadText} {'  '}
            <span>
              <img src={imagePreview} alt="image" height="20"/>
            </span>
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
          <h5 className="card-header">UPDATE CATEGORY <FontAwesomeIcon className="float-sm-right" icon={faListAlt}/></h5>  
          <div className="card-body">
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {updateCategoryForm()}
          </div>
        </div>
      </div>
    </Layout>
  )
}

update.getInitialProps = async ({req,query,token}) =>{
  const response = await axios.post(`${config.API}/category/${query.slug}`);
  return {oldCategory: response.data.category, token};
}
export default withAdmin(update);