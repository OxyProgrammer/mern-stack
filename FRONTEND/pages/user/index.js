import Layout from '../../components/Layout';
import axios from 'axios';
import * as config from '../../config';
import {getCookie} from '../../helpers/auth';

const User=({user})=>{
  return (<Layout>{JSON.stringify(user)}</Layout>);
}

User.getInitialProps = async (context) => {

  const token=getCookie('token',context.req);
  try{
    const response=await axios.get(`${config.API}/user`,{
      headers:{
        authorization:`Bearer ${token}`,
        contentType:'application/json'
      }
    });
    return {user:response.data};
  }catch(error){
    if(error.response.status===401){
      return {user:'no user'};
    }
  }
}

export default User;