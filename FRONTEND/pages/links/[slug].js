import { useState, useEffect, Fragment } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import * as config from '../../config';
import Head from 'next/head';
import renderHTML from 'react-render-html';
import moment from 'moment';
import produce from 'immer';
import InfiniteScroll from 'react-infinite-scroller';

const links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linksSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linksSkip);
  const [size, setSize] = useState(totalLinks);
  const [popular, setPopular] = useState([]);

  const head = () => {
    <Head>
      <title>
        {category.name} | {config.APP_NAME}
      </title>
      <meta name="description" content={category.content.substring(0,160)}/>
      <meta property="og:title" content={category.name}/>
      <meta property="og:description" content={category.description}/>
      <meta property="og:image" content={category.image.url}/>
      <meta property="og:image:secure_url" content={category.image.url}/>
    </Head>;
  };

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(
      `${config.API}/link/popular/${category.slug}`
    );
    setPopular(response.data);
  };

  const listOfPopularLinks = () => {
    return popular.map((link, idx) => (
      <div key={idx} className="alert alert-warning p-2">
        <div
          className="col col-md-8"
          onClick={(e) => handleLinkClick(link._id)}
        >
          <a href={link.url} target="_blank">
            <h6 className="pt-2">{link.title}</h6>
            <span className="pt-2 text-danger">{link.url}</span>
          </a>
        </div>

        <div className="col col-md-4">
          <p className="pull-right" style={{ fontSize: '12px' }}>
            {moment(link.createdAt).fromNow()} by {link.postedBy.name} Clicks:{' '}
            {link.clicks}
          </p>
        </div>
      </div>
    ));
  };

  const handleLinkClick = async (link) => {
    try {
      const response = await axios.put(`${config.API}/click-count`, {
        linkId: link._id,
      });
      const indexOfLink = allLinks.indexOf(link);
      const allLinksCopy = produce(allLinks, (draftAllLinks) => {
        draftAllLinks[indexOfLink].clicks = response.data.clicks;
      });
      setAllLinks(allLinksCopy);
    } catch (error) {
      console.log(error);
    }
  };

  const listOfLinks = () => {
    return allLinks.map((link, idx) => {
      return (
        <div key={idx} className="alert alert-primary">
          <div className="row">
            <div
              className="col-md-8"
              onClick={(event) => handleLinkClick(link)}
            >
              <a href={link.url} target="_blank">
                <h5>{link.title}</h5>
              </a>
            </div>
            <div className="col-md-4">
              <span className="float-right mt-2 text-success font-weight-bold">
                {moment(link.createdAt).fromNow()} by {link.postedBy.name}
                <br />
                <span className="badge badge-secondary float-right">
                  {link.clicks} clicks
                </span>
              </span>
            </div>
          </div>
          <div className="row">
            <span className="badge badge-info ml-3">{link.type}</span>
            <span className="badge badge-success ml-2">{link.medium}</span>
            {link.categories.map((category) => (
              <span key={category._id} className="badge badge-primary ml-2">
                {category.name}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${config.API}/category/${query.slug}`, {
      skipItems: toSkip,
      limitItems: limit,
    });
    setAllLinks([...allLinks, ...response.data.links]);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="row">
          <div className="col-md-3">
            <div className="card text-white bg-dark float left">
              <img
                className="fluid thumbnail"
                style={{ height: '200px' }}
                src={category.image.url}
                alt="Category image"
              />
            </div>
          </div>
          <div className="col-md-9" style={{ height: '200px' }}>
            <div
              className="font-weight-bold alert alert-success"
              style={{ height: '100%' }}
              role="alert"
            >
              <h4 className="alert-heading">{category.name} - URL/Links</h4>
              <hr />
              <p>{renderHTML(category.content || '')}</p>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-3">{listOfPopularLinks()}</div>
          <div className="col-md-9 ">
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={size > 0 && size >= limit}
              loader={
                <img
                  key={0}
                  src="/static/images/loading.gif"
                  alt="loading"
                ></img>
              }
            >
              {listOfLinks()}
            </InfiniteScroll>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

links.getInitialProps = async ({ query, request }) => {
  let skipItems = 0;
  let limitItems = 2;
  const response = await axios.post(`${config.API}/category/${query.slug}`, {
    skipItems,
    limitItems,
  });
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limitItems,
    linksSkip: skipItems,
  };
};

export default links;
