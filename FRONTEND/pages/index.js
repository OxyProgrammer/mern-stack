import Layout from '../components/Layout';
import axios from 'axios';
import * as config from '../config';
import Resizer from 'react-image-file-resizer';
import Link from 'next/link';

//Utility method and hence doesnt need recreation.
const getCategory=(category)=>{
  return (
    <div className="card" >
      <h5 className="card-header">{category.name}</h5>  
      <img className="fluid thumbnail"
          style={{"height": "150px"}} 
          src={category.image.url} 
          alt="Card image cap"></img>
        {/* <div className="card-body">
       
        </div> */}
      <div className="card-footer">
        {/* <button className="btn btn-sm btn-outline-success float-sm-right">See more...</button> */}
        <Link href="/"><a className="text-success float-sm-right">See links...</a></Link>
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
  return(
    <Layout>
      <div className="container">
        <div className="row">
          <h4 className="mx-2">Browse Tutorials / Courses</h4>
        </div>
        <div className="row">
          {getCategoriesUi(categories)}
        </div>
      </div>
    </Layout>)};

home.getInitialProps=async()=>{
  const response = await axios.get(`${config.API}/categories`);
  return { categories:response.data };
}

export default home;