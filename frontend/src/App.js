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
import SurveyResults from './survey/results';

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
            <Link to="/user/survey/new">New Survey</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <div className="site-layout-content">
          <Switch>
            <Route path="/survey/:surveyId/results" children={<SurveyResults />} />
            <Route path="/survey/:surveyId" children={<AddVote />} />
            <Route path="/user/survey/new">
              <NewSurvey />
            </Route>
            <Route path="/">
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>
                    Survey 
                  </p>
                </header>
              </div>
            </Route>
          </Switch>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}></Footer>
    </Layout>
    </Router>
  );
}

export default App;
