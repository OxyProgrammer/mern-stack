import {useEffect,useState} from 'react';
import axios from 'axios';
import * as config from '../../../config';
import Layout from '../../../components/Layout';
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts';

const create=()=>{

  const [state,setState]=useState({
    title:'',
    url:'',
    categories:'',
    loadedCategories:[],
    success:'',
    error:'',
    medium:'',
    type:''
  });

  const {title,url,categories,loadedCategories,success,error,medium,type}=state;

  const handleTitleChange = event=>{
    setState({...state, title:event.target.value,error:'',success:''});
  }
  
  const handleURLChange = event=>{
    setState({...state, url:event.target.value,error:'',success:''});
  }

  const handleSubmit = async event=>{
    
  }

  const submitLinkFrom=()=>{
    return (<form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input type="text" className="form-control" onChange={handleTitleChange} value={title}></input>
      </div>

      <div className="form-group">
        <label className="text-muted">URL</label>
        <input type="text" className="form-control" onChange={handleURLChange} value={url}></input>
      </div>

      <div>
        <button className="btn btn-success float-right" type="submit">Submit</button>
      </div>
    </form>)
  }

  const loadCategories = async ()=>{
    try{
      const response=await axios.get(`${config.API}/categories`);
      setState({...state,loadedCategories:response.data});
    }catch(error){

    }
  }

  useEffect(()=>{
    loadCategories()
  },[success])


  return(
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h3>Submit Link/URL</h3>
          <br/>
          <div className="row">
            <div className="col-md-4">XXXX</div>
            <div className="col-md-8">{submitLinkFrom()}</div>
          </div>
        </div>
      </div>
    </Layout>);
}

export default create;