import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import axios from 'axios';
import * as config from '../../../config';
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts';
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const read = ({user,token}) =>{
  const [state,setState]=useState({
    error:'',
    success:'',
    categories: []
  });

  const {error,success,categories}=state;

  useEffect(()=>{
    loadCategories();
  },[])

  const loadCategories = async ()=>{
    const response = await axios.get(`${config.API}/categories`);
    setState({...state,categories:response.data});
  }

  const confirmDelete = (e, slug)=>{
    e.preventDefault();
    let answer=window.confirm("Are you sure you want to delete the category?");
    if(answer){
      handleDelete(slug);
    }
  }
  const handleDelete=async slug=>{
    try{
      const response = await axios.delete(`${config.API}/category/${slug}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      console.log("CATEGORY DELETE SUCCESS");
      loadCategories();//ToDo: remove this and remove manually.
    }catch(error){
      console.log("CATEGORY DELETE ERROR",error);
    }
  }

  const listCategories = () =>
     categories.map((category)=>{
       return (
        <div key={category._id} className="col-sm-12 col-md-4 col-lg-3 my-2">
          <div className="card text-white bg-dark" >
            <h5 className="card-header"> 
              <Link href={`/links/${category.slug}`}>
                <a className="text-light">{category.name}</a>
              </Link>
            </h5>
            <img className="fluid thumbnail"
                style={{"height": "150px"}} 
                src={category.image.url} 
                alt="Category image"></img>
            <div className="card-footer">
              <button onClick={(e)=>confirmDelete(e, category.slug)} className="btn btn-danger btn-sm float-sm-right">
                <FontAwesomeIcon icon={faTrash}/>
              </button>
              <Link href={`/admin/category/${category.slug}`}>
                <button className="btn btn-success btn-sm float-sm-right mr-1">
                <FontAwesomeIcon icon={faPencilAlt}/>
              </button>
              </Link>
            </div>
          </div>
        </div>)
    });

  return(
    <Layout>
      <div className="row">
        <div className="col">
          <h5>List of categories</h5>
          <br/>
        </div>
      </div>
      <div className="row">{listCategories()}</div>
    </Layout>
);

}

export default withAdmin(read);