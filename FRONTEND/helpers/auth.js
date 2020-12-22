import cookie from 'js-cookie';
import Router from 'next/router';

//set in cookie
export const setCookie=(key,value)=>{
  if(process.browser){//if we are in client side
    cookie.set(key,value,{
      expires:1
    });
  }
}

//remove from cookie
export const removeCookie=(key)=>{
  if(process.browser){//if we are in client side
    cookie.remove(key);
  }
}

//get from cookie
//will be useful when we need to make requet to server with auth token
export const getCookie=(key,req)=>{
  return process.browser?getCookieFromBrowser(key):getCookieFromServer(key,req);
}

export const getCookieFromBrowser=(key)=>{
    return cookie.get(key);
}

export const getCookieFromServer=(key,req)=>{
  if(!req.headers.cookie){
    return undefined;
  }
  console.log('req.headers.cookie',req.headers.cookie);
  let token=req.headers.cookie.split(';').find(c=>c.trim().startsWith(`${key}=`));
  if(!token){
    return undefined;
  }
  let tokenValue=token.split('=')[1];
  console.log('getCookieFromServer',tokenValue);
  return tokenValue;
}

//set in localstorage
export const setLocalStorage=(key,value)=>{
  if(process.browser){//if we are in client side
    localStorage.setItem(key,JSON.stringify(value));
  }
}

//remove from local storage
export const removeLocalStorage=(key)=>{
  if(process.browser){//if we are in client side
    localStorage.removeItem(key);
  }
}

//authenticate user by passing data to cookie and localstorage during signin.
export const authenticate=(response,next)=>{
  // if(process.browser){//if we are in client side
  //   localStorage.removeItem(key);
  // }
  setCookie('token',response.data.token);
  setLocalStorage('user',response.data.user);
  next();
}

//access user info from localStorage isAuth().
export const isAuth=()=>{
  if(process.browser){
    const cookieChecked=getCookie('token');
    if(cookieChecked){
      const user=localStorage.getItem('user');
      if(user){
        return JSON.parse(user);
      }else{
        return false;
      }
    }
  }
}

//clears user data.
export const signOut=()=>{
  removeCookie('token');
  removeLocalStorage('user');
  Router.push('/login');
}