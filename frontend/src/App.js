import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Layout, Menu } from 'antd';
import NewSurvey from './survey/new';
import AddVote from './survey/add-vote';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/user/survey/new">New</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Switch>
            <Route path="/survey/:surveyId" children={<AddVote />} />
            <Route path="/user/survey/new">
              <NewSurvey />
            </Route>
            <Route path="/">
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>
                    Happy Father's Day!
                  </p>
                  <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn React
                  </a>
                </header>
              </div>
            </Route>
          </Switch>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Chobani United</Footer>
    </Layout>
    </Router>
  );
}

export default App;
