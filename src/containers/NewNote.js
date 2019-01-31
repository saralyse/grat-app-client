import React, { Component } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";
import { s3Upload } from "../libs/awsLib";


export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      inputOne: "",
      inputTwo: "",
      inputThree: ""
    };
  }

  validateForm() {
    return (
      this.state.inputOne.length > 0 &&
      this.state.inputTwo.length > 0 &&
      this.state.inputThree.length > 0
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      const attachment = this.file
        ? await s3Upload(this.file)
        : null;
        
      await this.createNote({
        attachment,
        inputOne: this.state.inputOne,
        inputTwo: this.state.inputTwo,
        inputThree: this.state.inputThree 
      });
      this.props.history.push("/");
    } catch(e) {
      alert(e);
      console.log(e);
      this.setState({ isLoading: false });
    }
  }

  createNote(note) {
    return API.post("notes", "/", {
      body: note
    });
  }

  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="inputOne">
            <FormControl
              onChange={this.handleChange}
              value={this.state.inputOne}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="inputTwo">
            <FormControl
              onChange={this.handleChange}
              value={this.state.inputTwo}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="inputThree">
            <FormControl
              onChange={this.handleChange}
              value={this.state.inputThree}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel
              bsClass="uploadLabel">
              <i className="fa fa-upload"></i>
              upload an attachment
            </ControlLabel>
            <FormControl
              onChange={this.handleFileChange}
              type="file"
              bsClass="fileUpload"
            />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="create"
            loadingText="adding to your memories..."
          />
        </form>
      </div>
    );
  }
}