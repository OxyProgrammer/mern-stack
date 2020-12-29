import {useEffect,useState, Fragment} from 'react';
import axios from 'axios';
import * as config from '../../../config';
import Layout from '../../../components/Layout';
import {getCookie, isAuth} from '../../../helpers/auth';
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts';
import react from 'react';

const create=({token})=>{

  const [state,setState]=useState({
    title:'',
    url:'',
    categories:[],
    loadedCategories:[],
    success:'',
    error:'',
    medium:'',
    type:''
  });

  const {title,url,categories,loadedCategories,success,error,medium,type}=state;
  
  useEffect(()=>{
    loadCategories()
  },[success]);

  const handleTitleChange = event=>{
    setState({...state, title:event.target.value,error:'',success:''});
  }
  
  const handleURLChange = event=>{
    setState({...state, url:event.target.value,error:'',success:''});
  }

  const getSubmitLinkForm=()=>{
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
        <button disabled={!token} className="btn btn-success float-right" type="submit">
          {isAuth() || token ? 'Post' : 'Login to post'}
        </button>
      </div>
    </form>)
  }

  const showCategories=()=>{
    return loadedCategories.map(category=>(
      <li className='list-unstyled' key={category._id}>
        <input type="checkbox" className="my-2" onChange={event=>handleToggle(event,category)}></input>
        <label className="form-check-label ml-1">{category.name}</label>
      </li>
    ));
  }

  const loadCategories = async ()=>{
    try{
      const response=await axios.get(`${config.API}/categories`);
      setState({...state,loadedCategories:response.data});
    }catch(error){

    }
  }

  const handleToggle=(event,category)=>{

    const clickedCategory = categories.indexOf(category);

    const all = [...categories];

    if(clickedCategory === -1){
      all.push(category);
    }else{
      all.splice(clickedCategory, 1);
    }

    setState({...state, categories:all, success:'', error:''});
  }

  const showTypes = ()=>(
    <Fragment>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input type="radio" 
            onChange={handleTypeClick} 
            checked={type === 'free'} 
            value="free" 
            name="type"/>
          Free
        </label>
      </div>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input type="radio" 
            onChange={handleTypeClick} 
            checked={type === 'paid'} 
            value="paid" 
            name="type"/>
          Paid
          </label>
      </div>
    </Fragment>
  );

  const handleTypeClick = event =>{
    setState({...state, type: event.target.value, success:'', error:''});
  }

  const showMedium = ()=>(
    <Fragment>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input type="radio" 
            onChange={handleMediumClick} 
            checked={medium === 'video'} 
            value="video" 
            name="medium"/>
          Video
        </label>
      </div>
        <div className="form-check ml-3">
        <label className="form-check-label">
          <input type="radio" 
            onChange={handleMediumClick} 
            checked={medium === 'book'} 
            value="book" 
            name="medium"/>
          Book
        </label>
      </div>
    </Fragment>
  );

  const handleMediumClick = event =>{
    setState({...state, medium: event.target.value, success:'', error:''});
  }

  const handleSubmit = async event=>{
    event.preventDefault();
    try{
      const response = axios.post(`${config.API}/link`,{title,url,categories,type,medium},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setState({
                ...state, 
                title:'',
                url:'', 
                success:'Link is created', 
                error:'', 
                categories:[], 
                type:'', 
                medium:'', 
                loadedCategories:[],})
    }catch(error){
      setState({...state, error:error.response.data.error});
      console.log(error);
    }
  }

  return(
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h3>Submit Link/URL</h3>
          <br/>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-muted ml-4">Category</label>
                <ul style={{maxHeight:'150px', overflowY:'scroll'}}>{showCategories()}</ul>
              </div>
              <div className="form-group">
                <label className="text-muted ml-4">Type</label>
                {showTypes()}
              </div>
              <div className="form-group">
                <label className="text-muted ml-4">Medium</label>
                {showMedium()}
              </div>
            </div>
            <div className="col-md-8">
              {success && showSuccessMessage(success)}
              {error && showErrorMessage(error)}
              {getSubmitLinkForm()}
            </div>
          </div>
        </div>
      </div>
    </Layout>);
}

create.getInitialProps=({req})=>{
  const token = getCookie('token', req);
  return {token};
}

export default create;