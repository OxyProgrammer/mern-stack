import {useEffect,useState} from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {withRouter} from 'next/router';
import {showSuccessMessage,showErrorMessage} from '../../../../helpers/alerts';
import * as config from '../../../../config';
import Layout from '../../../../components/Layout';

const ResetPassword=({router})=>{
  
  const [state,setState]=useState({
    name:'',
    token:'',
    newPassword:'',
    buttonText:'Submit',
    success:'',
    error:''
  });

  const {name,token,newPassword,buttonText,success,error}=state;

  useEffect(()=>{
    let token=router.query.token;
      if(token){
        const {name}=jwt.decode(token);
        setState({...state,name,token});
      }
    },[router]);

  const clickSubmit=async event=>{
      event.preventDefault();
      setState({...state,buttonText:'Changing...'});
      try{
        const response=await axios.put(`${config.API}/reset-password`,{newPassword,resetPasswordLink:token});
        setState({...state,token:'', buttonText:'Submit', newPassword:'', success:response.data.message});
      }catch(error){
        setState({...state,token:'', buttonText:'Submit', error:error.response.data.error});
      }
  }

  const handleChange=event=>{
      setState({...state,newPassword:event.target.value})
  }

  const passwordResetForm=()=>{
      return (
        <form>
          <div className="form-group">
            <input onChange={handleChange} 
              value={newPassword}
              type="password" 
              className="form-control" 
              placeholder="Enter new password" 
              required/>
          </div>
          <button className='btn btn-success btn-block float-right' onClick={clickSubmit}>{buttonText}</button>
        </form>
      )
  }

  return (<Layout>
    <div className="col-md-6 offset-md-3">
      <div className="card">
        <h5 className="card-header">G'day, {name}. Enter new password</h5>  
        <div className="card-body">
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordResetForm()}
        </div>
      </div>
    </div>
  </Layout>);
}

export default withRouter(ResetPassword);