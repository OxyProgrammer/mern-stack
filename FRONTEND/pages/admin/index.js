import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin=({user})=>{
  return (<Layout>
    <h5>Admin Dashboard</h5>
    <div className="row">
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            Categories
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item nav-item"> 
              <a href="/admin/category/create" className="nav-link">Create category</a>
            </li>
            <li className="list-group-item nav-item">
              <Link href="/admin/category/read">
                <a className="nav-link">All Categories</a>
              </Link>
            </li>
            <li className="list-group-item nav-item">
              <Link href="/admin/link/read">
                <a className="nav-link">All Links</a>
              </Link>
            </li>
            <li className="list-group-item nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link">Update profile</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-md-8">

      </div>
    </div>
    </Layout>);
}

export default withAdmin(Admin);