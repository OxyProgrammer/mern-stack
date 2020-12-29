import {useState} from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import * as config from '../../config';
import Link from 'next/link';
import renderHTML from 'react-render-html';

const links=({query, category, links, totalLinks, linksLimit, linksSkip})=>{

  const [allLinks, setAllLinks] = useState(links);
  
  const listOfLinks = () => {
    return allLinks.map((link,idx)=>{
      return (
        <div key={idx} className="col-md-9 alert alert-primary">
          {link.title}
        </div>
        );
    });
  }

  return(
    <Layout>
      <div className="row">
        <div className="col-md-9 font-weight-bold alert alert-success" role="alert">
          <h4 className="alert-heading">{category.name} - URL/Links</h4>
          <hr/>
          <p>{renderHTML(category.content || '')}</p>
        </div>
        <div className="col-md-3">
          <img className="float-right" src={category.image.url} alt={category.name} style={{width: 'auto', maxHeight: '200px'}}/>
        </div>
      </div>
      <div className="row">
        {/* {JSON.stringify(allLinks.length)} */}
        {listOfLinks()}
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