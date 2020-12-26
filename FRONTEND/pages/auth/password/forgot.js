import {useEffect,useState} from 'react';
import axios from 'axios';
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts';
import * as config from '../../../config';
import Layout from '../../../components/Layout';


const ForgotPassword=(props)=>{

  const [state,setState]=useState({
    email:'',
    buttonText:'Forgot Password',
    success:'',
    error:''
  });
  const {email,buttonText,success,error}=state;

  const handleChange=event=>{
    setState({...state,email:event.target.value})
  }

  const handleSubmit=async event=>{
    event.preventDefault();
    setState({...state,buttonText:'Working...'})
    try{
      const response=await axios.put(`${config.API}/forgot-password`,{email});
      console.log(response)
      setState({...state,buttonText:'Forgot Password',email:'',error:'',success:response.data.message});
    }catch(error){
      setState({...state,buttonText:'Forgot Password',success:'',error:error.response.data.error});
    }
  }

  const passwordForgotForm=()=>{
    return (<form onSubmit={handleSubmit}>
      <div className="form-group">
        <input type="email" 
        className="form-control" 
        value={email} 
        onChange={handleChange} 
        placeholder="Enter your email"
        required/>
      </div>
      <div>
        <button className="btn btn-primary float-right">
          {buttonText}
        </button>
      </div>
    </form>)
  }

  return(
    <Layout>
      <div className="col-md-6 offset-md-3">
      <div className="card">
        <h5 className="card-header">FORGOT PASSWORD</h5>  
        <div className="card-body">
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordForgotForm()}
        </div>
      </div>
    </div>
    </Layout>
  );
}

export default ForgotPassword;