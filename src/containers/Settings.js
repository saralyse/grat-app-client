import React, { Component } from "react";
import MediaQuery from "react-responsive";
import {
  Nav,
  NavItem,
  TabContainer,
  TabContent,
  TabPane,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ChangeEmail from "../containers/ChangeEmail";
import ChangePassword from "../containers/ChangePassword";
import BillingSettings from "../containers/BillingSettings";
import "./Settings.css";
import SettingsDropdown from "../components/SettingsDropdown";

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    return (
      <div className="Settings">
        <MediaQuery maxDeviceWidth={500}>
          {(matches) => {
            if (matches) {
              return (
                <div className="settings-mobile">
                  <SettingsDropdown />
                  <div className="settings-mobile-list">
                    <Link to="/settings/email">
                      change your email address
                    </Link>
                    <Link to="/settings/password">
                      update my password
                    </Link>
                    <Link to="/settings/billing">
                      view my billings settings
                    </Link>
                  </div>
                </div>
                
              );
            } else {
              return (
                <div className="settings-tab-menu">
                  <TabContainer id="settings-inner" defaultActiveKey="email">
                    <Row>
                      <Col sm={5}>
                        <Nav className="flex-column settings-nav">
                          <NavItem eventKey="email">update email</NavItem>
                          <NavItem eventKey="password">change password</NavItem>
                          <NavItem eventKey="billing">billing information</NavItem>
                        </Nav>
                      </Col>
                      <Col sm={7}>
                        <TabContent>
                          <TabPane eventKey="email">
                            <ChangeEmail />
                          </TabPane>
                          <TabPane eventKey="password">
                            <ChangePassword />
                          </TabPane>
                          <TabPane eventKey="billing">
                            <BillingSettings />
                          </TabPane>
                        </TabContent>
                      </Col>
                    </Row>
                  </TabContainer>
                </div>
              );
            }
          }}
        </MediaQuery>
      </div>
    );
  }
}