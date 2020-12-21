import React,{useState} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

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

  const nav = () => ( <div className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <a className="navbar-brand" href="/">MERN-A</a>
      <button className="custom-toggler navbar-toggler" type="button" 
            data-toggle="collapse" data-target="#navbarsExample09" 
            aria-controls="navbarsExample09" 
            aria-expanded={!isNavCollapsed ? true : false} 
            aria-label="Toggle navigation" 
            onClick={handleNavCollapse}>
          <span className="navbar-toggler-icon"></span>
        </button>
      <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}>
       <ul className="navbar-nav ml-auto">
         <li className="nav-item">
             <Link href="/">
               <a className="nav-link">Home</a>
             </Link>
         </li>
         <li className="nav-item">
           <Link href="/login">
             <a className="nav-link">Login</a>
           </Link>
         </li>
         <li className="nav-item">
             <Link href="/register">
               <a className="nav-link">Register</a>
             </Link>
         </li>
       </ul>
     </div>
    </div>
  </div>
  );

  return <React.Fragment>{head()} {nav()}<div className="container py-5">{children}</div> </React.Fragment>;
}

export default layout;