import React from "react";
import { NavDropdown, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./SettingsDropdown.css";

export default () =>
  <div className="SettingsDropdown">
    <NavDropdown id="settings-dropdown" title="settings">
      <LinkContainer to="/settings/email">
        <NavItem>update email</NavItem>
      </LinkContainer>
      <LinkContainer to="/settings/password">
        <NavItem>change password</NavItem>
      </LinkContainer>
      <LinkContainer to="/settings/email">
        <NavItem>billing information</NavItem>
      </LinkContainer>
    </NavDropdown>
  </div>