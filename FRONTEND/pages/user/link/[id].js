import react from 'react';
import withUser from '../../withUser';
import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import * as config from '../../../config';
import Layout from '../../../components/Layout';
import { getCookie, isAuth } from '../../../helpers/auth';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const update = ({ oldLink, token }) => {
  const [state, setState] = useState({
    title: oldLink.title,
    url: oldLink.url,
    categories: oldLink.categories,
    loadedCategories: [],
    success: '',
    error: '',
    medium: oldLink.medium,
    type: oldLink.type
  });

  const {
    title,
    url,
    categories,
    loadedCategories,
    success,
    error,
    medium,
    type,
  } = state;

  useEffect(() => {
    loadCategories();
  }, [success]);

  const handleTitleChange = (event) => {
    setState({ ...state, title: event.target.value, error: '', success: '' });
  };

  const handleURLChange = (event) => {
    setState({ ...state, url: event.target.value, error: '', success: '' });
  };

  const getSubmitLinkForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Title..."
            onChange={handleTitleChange}
            value={title}
          ></input>
        </div>

        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter URL..."
            onChange={handleURLChange}
            value={url}
          ></input>
        </div>

        <div>
          <button
            disabled={!token}
            className="btn btn-sm btn-success float-right"
            type="submit"
          >
            {isAuth() || token ? 'Update' : 'Login to update'}
          </button>
        </div>
      </form>
    );
  };

  const showCategories = () => {
    return loadedCategories.map((category) => (
      <div className="form-check" key={category._id}>
        <input
          className="form-check-input"
          type="checkbox"
          checked={categories.includes(category._id)}
          value=""
          onChange={(event) => handleToggle(event, category)}
        />
        <label className="form-check-label">{category.name}</label>
      </div>
    ));
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${config.API}/categories`);
      setState({ ...state, loadedCategories: response.data });
    } catch (error) {}
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

  const showTypes = () => (
    <Fragment>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="type"
          value="free"
          onChange={handleTypeClick}
          checked={type === 'free'}
        />
        <label className="form-check-label">Free</label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="type"
          value="paid"
          onChange={handleTypeClick}
          checked={type === 'paid'}
        />
        <label className="form-check-label">Paid</label>
      </div>
    </Fragment>
  );

  const handleTypeClick = (event) => {
    setState({ ...state, type: event.target.value, success: '', error: '' });
  };

  const showMedium = () => (
    <Fragment>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="medium"
          value="video"
          onChange={handleMediumClick}
          checked={medium === 'video'}
        />
        <label className="form-check-label">Video</label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="medium"
          value="book"
          onChange={handleMediumClick}
          checked={medium === 'book'}
        />
        <label className="form-check-label">Book</label>
      </div>
    </Fragment>
  );

  const handleMediumClick = (event) => {
    setState({ ...state, medium: event.target.value, success: '', error: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${config.API}/link/${oldLink._id}`,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({...state, success: 'Link is updated'});
    } catch (error) {
      setState({ ...state, error: error.response.data.error });
      console.log(error);
    }
  };

  return (
    <Layout>
      
      <div className="row">
        <div className="col-md-12">
          <h3>Submit Link/URL</h3>
          <br />
          <div className="row">
            <div className="col-sm-4">
              <div className="form-group">
                <div className="card">
                  <h5 className="card-header">Category</h5>
                  <div
                    className="card-body"
                    style={{ maxHeight: '150px', overflowY: 'auto' }}
                  >
                    {showCategories()}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="card">
                  <h5 className="card-header">Type</h5>
                  <div className="card-body">{showTypes()}</div>
                </div>
              </div>
              <div className="form-group">
                <div className="card">
                  <h5 className="card-header">Medium</h5>
                  <div className="card-body">{showMedium()}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-8">
              {success && showSuccessMessage(success)}
              {error && showErrorMessage(error)}
              {getSubmitLinkForm()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

update.getInitialProps = async ({ req, token, query }) => {
  const response = await axios.get(`${config.API}/link/${query.id}`);
  return { oldLink: response.data, token };
};

export default withUser(update);
