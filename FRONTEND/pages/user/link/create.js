import {useEffect,useState} from 'react';
import axios from 'axios';
import * as config from '../../../config';
import Layout from '../../../components/Layout';
import {showSuccessMessage,showErrorMessage} from ',,/../../helpers/alerts';

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
          {JSON.stringify(loadedCategories.length)}
        </div>
      </div>
    </Layout>);
}

export default create;