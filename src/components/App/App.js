import React, { useState, useEffect, lazy, Suspense } from 'react';
import Status from './Status';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { fetchServerStatus } from '../../lib/api';
import { useToken } from '../../lib/helpers';

import Loading from '../Loading';
import Post from '../Post';

const Login = lazy(() => import('../Login'));
const Posts = lazy(() => import('../Posts'));
// const Post = lazy(() => import('../Post'));

function App() {
  const isOnline = useIsOnline();
  const token = useToken();

  return (
    <Router>
      <header className="App_Header">
        <nav className="App_Nav">
          <ul>
            <li>
              <Link to="/">BlogEditor</Link>
            </li>
          </ul>
        </nav>
        <div className="Status">
          <Status status={isOnline} />
          {token ? (
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          ) : (
            ''
          )}
        </div>
      </header>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/posts/new" exact>
            {!token ? <Redirect to="/login" /> : <h1>new</h1>}
          </Route>
          <Route path="/posts/:postId" exact>
            {!token ? <Redirect to="/login" /> : <Post />}
          </Route>
          <Route path="/posts/:postId/edit" exact>
            {!token ? <Redirect to="/login" /> : <h1>Edit</h1>}
          </Route>
          <Route path="/login">{token ? <Redirect to="/" /> : <Login />}</Route>
          <Route path="/">
            {!token ? <Redirect to="/login" /> : <Posts />}
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

// fetch server status and return status state
function useIsOnline() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const status = await fetchServerStatus();

      if (!status.error) {
        setIsOnline(true);
      } else {
        console.error('Failed connection to API, Try to reconnect in 10sec');
        setIsOnline(false);
        setTimeout(fetch, 10000);
      }
    };

    fetch();
  });

  return isOnline;
}

export default App;

function handleLogout() {
  localStorage.removeItem('token');
  window.location.reload();
}
