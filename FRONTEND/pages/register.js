import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import Router from 'next/router';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import * as config from '../config';
import { isAuth } from '../helpers/auth';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const register = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Register',
    loadedCategories: [],
    categories: [],
  });

  const {
    name,
    email,
    password,
    error,
    success,
    buttonText,
    loadedCategories,
    categories,
  } = state;

  useEffect(() => {
    isAuth() && Router.push('/');
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${config.API}/categories`);
      setState({ ...state, loadedCategories: response.data });
    } catch (error) {}
  };

  const showCategories = () => {
    return loadedCategories.map((category) => (
      <div className="form-check" key={category._id}>
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          onChange={(event) => handleToggle(event, category)}
        />
        <label className="form-check-label">{category.name}</label>
      </div>
    ));
  };

  const handleChange = (inputId) => (event) => {
    setState({
      ...state,
      [inputId]: event.target.value,
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, buttonText: 'Registering' });
    try {
      const response = await axios.post(`${config.API}/register`, {
        name,
        email,
        password,
        categories,
      });
      setState({
        ...state,
        name: '',
        email: '',
        password: '',
        buttonText: 'Submitted',
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: 'Register',
        error: error.response.data.error,
      });
    }
  };

  const handleToggle = (event, category) => {
    const clickedCategory = categories.indexOf(category);

    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(category);
    } else {
      all.splice(clickedCategory, 1);
    }

    setState({ ...state, categories: all, success: '', error: '' });
  };

  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            onChange={handleChange('name')}
            value={name}
            type="text"
            className="form-control"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <input
            onChange={handleChange('email')}
            value={email}
            type="email"
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <input
            onChange={handleChange('password')}
            value={password}
            type="password"
            className="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-group">
          <h5 className="text-muted">Categories</h5>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {showCategories()}
          </div>
        </div>
        <div className="form-group">
          <button className="btn btn-primary float-sm-right">
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <div className="card">
          <h5 className="card-header">
            Register{' '}
            <FontAwesomeIcon className="float-sm-right" icon={faUserPlus} />
          </h5>
          <div className="card-body">
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {registerForm()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default register;
