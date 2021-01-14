import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import * as config from '../../../config';
import { updateUser } from '..../../../helpers/auth';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withUser from '../../withUser';

const profile = ({ user, token }) => {
  const [state, setState] = useState({
    name: user.name,
    email: user.email,
    password: '',
    error: '',
    success: '',
    buttonText: 'Update',
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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${config.API}/categories`);
      const userCategories = [];
      if (user.categories) {
        for (let i = 0; i < response.data.length; i++) {
          if (user.categories.includes(response.data[i]._id)) {
            userCategories.push(response.data[i]);
          }
        }
        setState({
          ...state,
          categories: userCategories,
          loadedCategories: response.data,
        });
      }
    } catch (error) {}
  };

  const showCategories = () => {
    return loadedCategories.map((category) => (
      <div className="form-check" key={category._id}>
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          checked={categories.map((c) => c._id).includes(category._id)}
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
      buttonText: 'Update',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, buttonText: 'Updating...' });
    try {
      const response = await axios.put(
        `${config.API}/user`,
        {
          name,
          password,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateUser(response.data, () => {
        setState({
          ...state,
          buttonText: 'Submitted',
          success: 'Profile updated successfully',
        });
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: 'Update',
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

  const updateForm = () => {
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
            disabled
          />
        </div>

        <div className="form-group">
          <input
            onChange={handleChange('password')}
            value={password}
            type="password"
            className="form-control"
            placeholder="Enter your password"
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
            Update profile{' '}
            <FontAwesomeIcon className="float-sm-right" icon={faSave} />
          </h5>
          <div className="card-body">
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {updateForm()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withUser(profile);
