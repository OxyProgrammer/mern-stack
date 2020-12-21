import { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import {showSuccessMessage,showErrorMessage} from '../helpers/alerts';
import * as config from '../config';

const register = () => {
  
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Register'
  });

  const { name, email, password, error, success, buttonText } = state;

  const handleChange = (inputId) => (event) => {
    setState({ ...state, [inputId]: event.target.value, error: '', success: '', buttonText: 'Register' });
  }

  const handleSubmit = async event=>{
    event.preventDefault();
    setState({...state,buttonText:'Registering'});
    try{
      const response = await axios.post(`${config.API}/register`,{name, email, password });
      setState({...state, name:'', email:'', password:'', buttonText:'Submitted', success:response.data.message });
    }catch(error){
      setState({...state, buttonText:'Register', error:error.response.data.error });
    }
  }

  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <input onChange={handleChange('name')} 
            value={name}
            type="text" 
            className="form-control" 
            placeholder="Enter your name"
            required />
        </div>

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

  return (<Layout>
    <div className="col-md-6 offset-md-3">
      <h1>Register </h1>
      <br/>
      {success&& showSuccessMessage(success)}
      {error&& showErrorMessage(error)}
      {registerForm()}
    </div>
  </Layout >);
};

export default register;