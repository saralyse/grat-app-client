import React, { Component } from "react";
import { API } from "aws-amplify";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "../components/BillingForm";
import config from "../config";
import "./BillingSettings.css";
import SettingsDropdown from "../components/SettingsDropdown";


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
      <div>
        <div className="mobile-settings">
          <SettingsDropdown />
        </div>
        <div className="BillingSettings"> 
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