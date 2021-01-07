import axios from 'axios';
import * as config from '../config';
import { getCookie } from '../helpers/auth';

const withUser = (Page) => {
  const withAuthUser = (props) => <Page {...props} />;
  withAuthUser.getInitialProps = async (context) => {
    const token = getCookie('token', context.req);
    let user = null;
    let userLinks = [];
    if (token) {
      try {
        const response = await axios.get(`${config.API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: 'application/json',
          },
        });
        user = response.data.user;
        userLinks = response.data.links;
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          user = null;
        }
      }
    }
    if (user === null) {
      //redirect
      context.response.writeHead(302, {
        Location: '/',
      });
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
        userLinks
      };
    }
  };
  return withAuthUser;
};

export default withUser;
