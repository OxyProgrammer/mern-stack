import {useState, Fragment} from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import * as config from '../../config';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';

const links=({query, category, links, totalLinks, linksLimit, linksSkip})=>{

  const [allLinks, setAllLinks] = useState(links);
  
  const listOfPopularLinks=()=>{
    return (<div className="row">
     <div className="col-md-12 alert alert-primary">
        Popular links
      </div>
      <div className="col-md-12 alert alert-primary">
        Popular links
      </div>
      <div className="col-md-12 alert alert-primary">
        Popular links
      </div>
    </div>)
  }

  const listOfLinks = () => {
    return allLinks.map((link,idx)=>{
      return (
          <div key={idx} className="alert alert-primary">
            <div className="row">
              <div className="col-md-8">
                <a href={link.url} target="_blank">
                  <h5 >{link.title}</h5>
                </a>
              </div>
              <div className="col-md-4">
                <span className="float-right mt-2 text-success font-weight-bold">
                  {moment(link.createdAt).fromNow()} by {link.postedBy.name}
                </span>
              </div>
            </div>
            <div className="row">
              <span className="badge badge-info ml-3">{link.type}</span>
              <span className="badge badge-success ml-2">{link.medium}</span>
              {link.categories.map(category=>(<span key={category._id} className="badge badge-primary ml-2">{category.name}</span>))}
            </div>
          </div>
        );
    });
  }

  return(
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <div className="card text-white bg-dark float left" >
            <img className="fluid thumbnail"
                style={{"height": "200px"}} 
                src={category.image.url} 
                alt="Category image"/>
          </div>
        </div>
        <div className="col-md-9">
          <div className="font-weight-bold alert alert-success" role="alert">
            <h4 className="alert-heading">{category.name} - URL/Links</h4>
            <hr/>
            <p>{renderHTML(category.content || '')}</p>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-3">
          {listOfPopularLinks()}
        </div>
        <div className="col-md-9 ">
          {listOfLinks()} 
        </div>
      </div>
    </Layout>
  )
}

links.getInitialProps = async ({query, request})=>{
  let skipItems = 0;
  let limitItems = 2;
  const response = await axios.post(`${config.API}/category/${query.slug}`,{
    skipItems,
    limitItems
  });
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks:response.data.links,
    linksLimit:limitItems,
    linksSkip:skipItems
  };
}

export default links;