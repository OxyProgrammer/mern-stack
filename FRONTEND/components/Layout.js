import React,{useState} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {isAuth,signOut} from '../helpers/auth';


//#region The following code is responsible for the navbar progress bar.
//https://nextjs.org/docs/api-reference/next/router
Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();
//#endregion


const layout = ({ children }) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const head = () => (
    <React.Fragment>
      <link rel="stylesheet" href="/static/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/static/css/styles.css" />
    </React.Fragment>
  );

  const nav = () => ( <div className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
    <div className="container">
      <a className="navbar-brand" href="/">MERN-A</a>
      <button className="custom-toggler navbar-toggler" type="button" 
            data-toggle="collapse" data-target="#navItemsContainer" 
            aria-controls="navItemsContainer" 
            aria-expanded={!isNavCollapsed ? true : false} 
            aria-label="Toggle navigation" 
            onClick={handleNavCollapse}>
          <span className="navbar-toggler-icon"></span>
        </button>
      <div id="navItemsContainer" className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}>
       <ul className="navbar-nav ml-auto">
         <li className="nav-item">
             <Link href="/">
               <a className="nav-link">HOME</a>
             </Link>
         </li>

         <li className="nav-item">
             <Link href="/user/link/create">
               <a className="nav-link text-success">SUBMIT LINK</a>
             </Link>
         </li>

          {
           !isAuth() && (
             <React.Fragment>
               <li className="nav-item">
                <Link href="/login">
                  <a className="nav-link">LOGIN</a>
                </Link>
              </li>
              <li className="nav-item">
                  <Link href="/register">
                    <a className="nav-link">REGISTER</a>
                  </Link>
              </li>
             </React.Fragment>
           )
          }

         {
           isAuth() && isAuth().role==='admin' &&(
            <li className="nav-item">
              <Link href="/admin">
                <a className="nav-link">{isAuth().name}</a>
              </Link>
            </li>
           )
         }

        {
           isAuth() && isAuth().role==='subscriber' && (
            <li className="nav-item">
              <Link href="/user">
                <a className="nav-link">{isAuth().name.toUpperCase()}</a>
              </Link>
            </li>
           )
         }

        {
          isAuth() && (<li className="nav-item">
          <a onClick={signOut} style={{cursor:"pointer"}} className="nav-link font-weight-bold">LOGOUT</a>
        </li>)
        }
            
       </ul>
     </div>
    </div>
  </div>
  );

  return <React.Fragment>{head()} {nav()}<div className="container py-5">{children}</div> </React.Fragment>;
}

export default layout;