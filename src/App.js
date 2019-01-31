import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import logo from './logo.svg';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
  
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">
                <img
                  src={logo}
                  alt="logo"
                  width="32"
                  height="32"
                  className="nav-logo d-inline-block align-top"
                />
                {' be grateful.'}
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? <NavItem onClick={this.handleLogout}>logout</NavItem>
                : <Fragment>
                    <LinkContainer to="/signup">
                      <NavItem>signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>login</NavItem>
                    </LinkContainer>
                </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
          <img src={logo} className="App-logo" alt="logo" />
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}


export default withRouter(App);