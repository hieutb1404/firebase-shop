//BroserRouter = router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routers';
import DefaultLayout from '~/layouts/DefaultLayout';
import { Fragment } from 'react';
import config from '~/config';
import { Navigate } from 'react-router-dom';
import AdminOnlyRoute from '~/components/AdminOnlyRoute/AdminOnlyRoute';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="App">
        {/* trng Routes luôn có  Route*/}
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          <Route
            // dấu / tương tưởng với link home, và home tương tương với /
            path="/"
            element={<Navigate to={config.routers.home} />} // path '/' = với 'home', 2 đường dẫn là 1
          />

          <Route
            path={config.routers.admin}
            element={
              // nếu đăng nhập = email chỉ định làm admin thì mới có thể vào trang Admin
              // nó sẽ so sánh nếu đúng = email admin thì nó sẽ trả return children (trong children có <Admin/> và <h1>login</h1>)
              <AdminOnlyRoute>
                {/* muốn lấy <admin/> này nó sẽ phải so sánh email đầu tiên, nếu đúng email chỉ định nó sẽ lấy <admin/> */}
                <Admin />
              </AdminOnlyRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
