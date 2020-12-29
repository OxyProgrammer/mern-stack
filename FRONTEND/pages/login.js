import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';
import {showSuccessMessage,showErrorMessage} from '../helpers/alerts';
import * as config from '../config';
import {authenticate,isAuth} from '../helpers/auth';
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const login = () => {

  const [state,setState]=useState({
    email: 'siddhartha.sarkar28@gmail.com',
    password: 'Babai@12345',
    error: '',
    success: '',
    buttonText: 'Submit'
  });

  useEffect(()=>{
    isAuth() && Router.push('/');
  });

  const { email, password, error, success, buttonText } = state;

  const handleSubmit = async event=>{
    event.preventDefault();
    setState({...state,buttonText:'Signing in..'});
    try{
      const response = await axios.post(`${config.API}/signin`,{ email, password });
      authenticate(response,()=>{
        isAuth() && isAuth().role==='admin'
        ?Router.push('/admin')
        :Router.push('/user');
      });
    }catch(error){
      setState({...state, buttonText:'Sign In', error:error.response.data.error });
    }
  };

  const handleChange=inputId=>event=>{
    setState({ ...state, [inputId]: event.target.value, error: '', success: '', buttonText: 'Sign In' });
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input onChange={handleChange('email')} 
            value={email}
            type="email" 
            className="form-control" 
            placeholder="Enter your email" 
            required/>
        </div>
        <div className="form-group">
          <input onChange={handleChange('password')} 
            value={password}
            type="password" 
            className="form-control" 
            placeholder="Enter your password" 
            required/>
        </div>
        <div className="form-group">
          <button className="btn btn-success float-sm-right">{buttonText}</button>
        </div>
      </form>)
  }

return(
  <Layout>
    <div className="col-md-6 offset-md-3">
      <div className="card">
        <h5 className="card-header">SIGN IN <FontAwesomeIcon className="float-sm-right" icon={faSignInAlt}/></h5>  
        <div className="card-body">
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {loginForm()}
          <Link href="/auth/password/forgot">
            <a href="#" className="text-danger text-uppercase font-weight-bold float-left mt-2" role="button">Forgot password</a>
            {/* <a className="text-primary float-left"><strong>Forgot password</strong></a> */}
          </Link>
        </div>
      </div>
    </div>
  </Layout>
)};

export default login;