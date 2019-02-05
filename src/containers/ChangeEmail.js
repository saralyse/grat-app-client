import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import SettingsDropdown from "../components/SettingsDropdown";
import "./ChangeEmail.css";


export default class ChangeEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      codeSent: false,
      isConfirming: false,
      isSendingCode: false
    };
  }

  validateEmailForm() {
    return this.state.email.length > 0;
  }

  validateConfirmForm() {
    return this.state.code.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleUpdateClick = async event => {
    event.preventDefault();

    this.setState({ isSendingCode: true });

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: this.state.email });

      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isSendingCode: false });
    }
  };

  handleConfirmClick = async event => {
    event.preventDefault();

    this.setState({ isConfirming: true });

    try {
      await Auth.verifyCurrentUserAttributeSubmit("email", this.state.code);

      this.props.history.push("/settings");
    } catch(e) {
      alert(e.message);
      this.setState({ isConfirming: false });
    }
  };

  renderUpdateForm() {
    return (
      <form onSubmit={this.handleUpdateClick}>
        <FormGroup bsSize="large" controlId="email">
          <ControlLabel>email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          text="update email"
          loadingText="updating..."
          disabled={!this.validateEmailForm()}
          isLoading={this.state.isSendingCode}
        />
      </form>
    );
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
          <ControlLabel>confirmation code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.code}
            onChange={this.handleChange}
          />
          <HelpBlock>
            please check your email at ({this.state.email}) from your confirmation code.
          </HelpBlock>
        </FormGroup>
        <LoaderButton
            block
            type="submit"
            bsSize="large"
            text="confirm"
            loadingText="confirming..."
            isLoading={this.state.isConfirming}
            disabled={!this.state.validateConfirmForm()}
          />
      </form>
    );
  }

  render() {
    return (
      <div>
        <div className="mobile-settings">
          <SettingsDropdown />
        </div>
        <div className="ChangeEmail">
          {!this.state.codeSent
            ? this.renderUpdateForm()
            : this.renderConfirmationForm()}
        </div>
      </div>
    );
  }
}
