import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';
import {showSuccessMessage,showErrorMessage} from '../helpers/alerts';
import * as config from '../config';
import {authenticate} from '../helpers/auth';

const login = () => {

  const [state,setState]=useState({
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Submit'
  });

  const { email, password, error, success, buttonText } = state;

  const handleSubmit = async event=>{
    event.preventDefault();
    setState({...state,buttonText:'Signing in..'});
    try{
      const response = await axios.post(`${config.API}/signin`,{ email, password });
      authenticate(response,()=>{
        Router.push('/');
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
          <button className="btn btn-primary">{buttonText}</button>
        </div>
      </form>)
  }

return(
  <Layout>
    <div className="col-md-6 offset-md-3">
      <h1>Login</h1>
      <br/>
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      {loginForm()}
    </div>
  </Layout>
)};

export default login;