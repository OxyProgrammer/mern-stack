import Layout from '../../components/Layout';
import withUser from '../withUser';
import Link from 'next/link';
import moment from 'moment';
import Router from 'next/router';
import axios from 'axios';
import * as config from '../../config';

const User = ({token, user, userLinks }) => {

  const confirmDelete=  (e, linkId)=>{
    e.preventDefault();
    let answer=window.confirm("Are you sure you want to delete the link?");
    if(answer){
      handleDelete(linkId);
    }
  }
  const handleDelete= async (linkId)=>{
    try{
      const response = await axios.delete(`${config.API}/link/${linkId}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      Router.replace('/user');
    }catch(error){
      console.log("LINK DELETE ERROR",error);
    }
  }

  const listOfLinks = () =>
    userLinks.map((link, idx) => {
      return (
        <div key={idx} className="row alert alert-info p-2">
          <div className="col-md-8">
            <h6>{link.title}</h6>
            <a className="nav-link pull-left" target="_blank" href={link.url}>
              {link.url}
            </a>
          </div>
          <div className="col-md-4">
            <span className="pull-right">
              {moment(link.createdAt).fromNow()} by {link.postedBy.name}
            </span>
          </div>
          <div className="col-md-12">
            <span className="badge text-dark">
              {link.type}/{link.medium}
            </span>
            {link.categories.map((c, i) => (
              <span className="badge text-success" key={i}>
                {c.name}
              </span>
            ))}
            <span className="badge text-secondary">{link.clicks} Clicks</span>
            <span onClick={(e)=>confirmDelete(e,link._id)} className="badge text-danger pull-right">Delete</span>
            <Link href={`/user/link/${link._id}`} >
              <span className="badge text-warning pull-right">Update</span>
            </Link>
          </div>
        </div>
      );
    });

  return (
    <Layout>
      <h5>
        {user.name}'s dashboard/<span className="text-info">{user.role}</span>
      </h5>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <ul className="list-group list-group-flush">
                <li className="list-group-item nav-item">
                  <Link href="/user/link/create">
                    <a className="nav-link">Submit a link</a>
                  </Link>
                </li>
                <li className="list-group-item nav-item">
                  <Link href="/user/profile/update">
                    <a className="nav-link">All Categories</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-8">
            <h6>Your links</h6>
            <hr />
            {listOfLinks()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withUser(User);
