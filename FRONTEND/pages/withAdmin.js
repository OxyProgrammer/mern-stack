import axios from 'axios';
import * as config from '../config';
import { getCookie } from '../helpers/auth';

const withAdmin = (Page) => {
  const withAdminUser = (props) => <Page {...props} />;
  withAdminUser.getInitialProps = async (context) => {
    const token = getCookie('token', context.req);
    let user = null;
    let userLinks = [];
    if (token) {
      try {
        const response = await axios.get(`${config.API}/admin`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: 'application/json',
          },
        });
        user = response.data.user;
        userLinks = response.data.links;
      } catch (error) {
        if (error.response.status === 401) {
          user = null;
          userLinks = null;
        }
      }
    }
    if (user === null) {
      //redirect
      context.response.writeHead(302, {
        Location: '/',
      });
      context.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
        userLinks,
      };
    }
  };
  return withAdminUser;
};

export default withAdmin;
