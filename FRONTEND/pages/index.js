import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import * as config from '../config';
import Link from 'next/link';
import moment from 'moment';

//Utility method and hence doesnt need recreation.
const getCategory=(category)=>{
  return (
    <div className="card text-white bg-dark" >
      <h6 className="card-header">{category.name}</h6>  
      <img className="fluid thumbnail"
          style={{"height": "100px"}} 
          src={category.image.url} 
          alt="Category image"></img>
      <div className="card-footer">
        {/* <button className="btn btn-sm btn-outline-success float-sm-right">See more...</button> */}
        <Link href={`/links/${category.slug}`}><a className="text-success float-sm-right">See links...</a></Link>
      </div>
    </div>
  );
}

const getCategoriesUi=(categories)=>{
  return categories.map(category=><div key={category._id} className="col-sm-12 col-md-4 col-lg-3 my-2">
        {getCategory(category)}
      </div>);
}

const home = ({categories}) => {

  const [popular, setPopular] = useState([]);

  const loadPopular = async () => {
    const response = await axios.get(`${config.API}/link/popular`);
    setPopular(response.data);
  };

  useEffect(() => {
    loadPopular();
  }, []);

  const handleClick = async (linkId) => {
    const response = await axios.put(`${config.API}/click-count`, { linkId });
    loadPopular();
  };

  const getLiskOfTrendingLinks = () => {
    return popular.map((link, idx) => (
      <div key={idx} className="alert alert-warning p-2">
        <div className="col col-md-8" onClick={(e) => handleClick(link._id)}>
          <a href="{link.url}" target="_blank">
            <h6 className="pt-2">{link.title}</h6>
            <span className="pt-2 text-danger" style={{ fontSize: '12px' }}>
              {link.url}
            </span>
          </a>
        </div>

        <div className="col col-md-4">
          <span className="pull-right" style={{ fontSize: '12px' }}>
            {moment(link.createdAt).fromNow()} by {link.postedBy.name} Clicks:{' '}
            {link.clicks}
          </span>
        </div>
      </div>
    ));
  };

  return(
    <Layout>
    <div className="container">
      <div className="row">
        <div className="col col-md-9">
          <div className="container">
            <div className="row">
              <h4>Browse Tutorials / Courses</h4>
            </div>
            <div className="row">{getCategoriesUi(categories)}</div>
          </div>
        </div>
        <div className="col col-md-3">
          <div className="container">
            <div className="row">
              <h4>Trending</h4>
            </div>
            <div className="row">{getLiskOfTrendingLinks()}</div>
          </div>
        </div>
      </div>
    </div>
  </Layout>)};

home.getInitialProps=async()=>{
  const response = await axios.get(`${config.API}/categories`);
  return { categories:response.data };
}

export default home;