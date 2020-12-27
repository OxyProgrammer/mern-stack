import Layout from '../components/Layout';
import axios from 'axios';
import * as config from '../config';
import Resizer from 'react-image-file-resizer';

//Utility method and hence doesnt need recreation.
const getCategory=(category)=>{
  return (
    <div className="card" >
      <h5 className="card-header">{category.name}</h5>  
        <div className="card-body">
        <img 
          style={{width: "200px", height: "200px"}} 
          src={category.image.url} 
          alt="Card image cap"></img>
        </div>
      <div className="card-footer">
        <button className="btn btn-outline-success float-sm-right">See more...</button>
      </div>
    </div>
  );
}

const getCategoriesUi=(categories)=>{
  return categories.map(category=><div key={category._id} className="col-sm-12-md-6-lg-3 mx-2 my-2">
        {getCategory(category)}
      </div>);
}

const home = ({categories}) => {
  return(
    <Layout>
      <div class="container">
        <div class="row">
          <h4 className="mx-2">Browse Tutorials / Courses</h4>
        </div>
        <div class="row">
          {getCategoriesUi(categories)}
        </div>
      </div>
    </Layout>)};

home.getInitialProps=async()=>{
  const response = await axios.get(`${config.API}/categories`);
  return { categories:response.data };
}

export default home;