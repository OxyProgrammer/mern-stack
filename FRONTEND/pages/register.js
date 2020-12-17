import { useState } from 'react';
import Layout from '../components/Layout';

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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.table(name,email,password);
  }

  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <input onChange={handleChange('name')} 
            value={name}
            type="text" 
            className="form-control" 
            placeholder="Enter your name" />
        </div>

        <div className="form-group">
          <input onChange={handleChange('email')} 
            value={email}
            type="email" 
            className="form-control" 
            placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <input onChange={handleChange('password')} 
            value={password}
            type="password" 
            className="form-control" 
            placeholder="Enter your password" />
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
      {registerForm()}
      <br/>
      {JSON.stringify(state)}
    </div>
  </Layout >);
};

export default register;