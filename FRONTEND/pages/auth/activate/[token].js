import {useEffect,useState} from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts';
import * as config from '../../../config';
import {withRouter} from 'next/router';
import Layout from '../../../components/Layout';

const ActivateAccount=({router})=>{

  const [state,setState]=useState({
    name:'',
    token:'',
    buttonText:'Activate Account',
    success:'',
    error:''
  })

  const {name,token,buttonText,success,error}=state;

  useEffect(()=>{
    let token=router.query.token;
      if(token){
        const {name}=jwt.decode(token);
        setState({...state,name,token});
      }
    },[router]);

  const clickSubmit=async event=>{
    event.preventDefault();
    setState({...state,buttonText:'Activating'});
    try{
      const response=await axios.post(`${config.API}/register/activate`,{token});
      console.log('response');
      setState({...state,name:'',token:'',buttonText:'Activate', success:response.data.message});
    }catch(error){
      setState({...state,name:'',token:'',buttonText:'Activate Account', error:error.response.data.error});
    }
  }

  return <Layout>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h3>G'Day {name}, Ready to activate your account?</h3>
          <br/>
          {success && showSuccessMessage(success)}
          {error && showSuccessMessage(error)}
          <button className='btn btn-success btn-block' onClick={clickSubmit}>{buttonText}</button>
        </div>
    </div>
  </Layout>
}

export default withRouter(ActivateAccount);