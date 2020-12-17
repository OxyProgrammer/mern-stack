import React from 'react';
// import Head from 'next/head';
import Router from 'next/router';
import Link from 'next/link';
import NProgress from 'nprogress';

//#region The following code is responsible for the navbar progress bar.
/*https://nextjs.org/docs/api-reference/next/router*/
Router.onRouteChangeStart = url => { NProgress.start(); }
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

//#endregion


const layout = ({ children }) => {

  const head = () => (
    <React.Fragment>
      <link rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossorigin="anonymous" />
      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
        integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
        crossorigin="anonymous" />
    </React.Fragment>
  );

  const nav = () => (
    <ul className="nav nav-tabs bg-warning">

      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-dark">Home</a>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/login">
          <a className="nav-link text-dark">Login</a>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/register">
          <a className="nav-link text-dark">Register</a>
        </Link>
      </li>

    </ul>
  );

  return <React.Fragment>{head()} {nav()}<div className="container py-5">{children}</div> </React.Fragment>;
}

export default layout;


