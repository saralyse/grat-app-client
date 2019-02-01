import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ChangePassword.css";

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      oldPassword: "",
      isChanging: false,
      confirmPassword: ""
    };
  }

  validateForm() {
    return (
      this.state.oldPassword.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleClickChange = async event => {
    event.preventDefault();

    this.setState({ isChanging: true });

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        this.state.oldPassword,
        this.state.password
      );

      this.props.history.push("/settings");
    } catch (e) {
      alert(e.message);
      this.setState({ isChanging: false });
    }
  };

  render() {
    return (
      <div className="ChangePassword">
        <form onSubmit={this.handleClickChange}>
          <FormGroup bsSize="large" controlId="oldPassword">
            <ControlLabel>current password</ControlLabel>
            <FormControl
              type="password"
              onChange={this.handleChange}
              value={this.state.oldPassword}
            />
          </FormGroup>
          <hr />
          <FormGroup bsSize="large" controlId="password">
            <ControlLabel>new password</ControlLabel>
            <FormControl
              type="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </FormGroup>
          <FormGroup bsSize="large" controlId="confirmPassword">
            <ControlLabel>confirm password</ControlLabel>
            <FormControl
              type="password"
              onChange={this.handleChange}
              value={this.state.confirmPassword}
            />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            text="change password"
            loadingText="changing..."
            disabled={!this.validateForm()}
            isLoading={this.state.isChanging}
          />
        </form>
      </div>
    );
  }
}