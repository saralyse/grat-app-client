import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import { Elements, StripeProvider } from "react-stripe-elements";
import LoaderButton from "../components/LoaderButton"
import BillingForm from "../components/BillingForm";
import config from "../config";
import "./Settings.css";

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  /// set up billing functions
  billUser(details) {
    return API.post("notes", "/billing", {
      body: details
    });
  }

  handleFormSubmit = async (storage, { token, error }) => {
    if (error) {
      alert(error);
      return;
    }

    this.setState({ isLoading: true });

    try {
      await this.billUser({
        storage,
        source: token.id
      });

      alert("Your card has been successfully processed!");
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="Settings">
        <div className="userSettings">
          <LinkContainer to="/settings/email">
            <LoaderButton
              block
              bsSize="large"
              text="Change Email"
            />
          </LinkContainer>
          <LinkContainer to="/settings/password">
            <LoaderButton
              block
              bsSize="large"
              text="Change Password"
            />
          </LinkContainer>
      </div>
        <div className="billingSettings">
          <StripeProvider apiKey={config.STRIPE_KEY}>
            <Elements>
              <BillingForm
                loading={this.state.isLoading}
                onSubmit={this.handleFormSubmit}
              />
            </Elements>
          </StripeProvider>
        </div>
      </div>
    );
  }
}