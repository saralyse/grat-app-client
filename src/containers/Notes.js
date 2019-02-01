import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import Moment from "react-moment";
import "./Notes.css";

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      inputOne: "",
      inputTwo: "",
      inputThree: "",
      createdDate: "",
      attachmentURL: null
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const note = await this.getNote();
      const createdDate = new Date(note.createdAt).toLocaleString();
      const { inputOne, inputTwo, inputThree, attachment } = note;

      if (attachment) {
        attachmentURL =  await Storage.vault.get(attachment);
      }

      this.setState({
        note,
        inputOne,
        inputTwo,
        inputThree,
        createdDate,
        attachmentURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  validateForm() {
    return (
      this.state.inputOne.length > 0 &&
      this.state.inputTwo.length > 0 &&
      this.state.inputThree.length > 0
    );
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  saveNote(note) {
    return API.put("notes", `/notes/$(this.props.match.params.id)`, {
      body: note
    });
  }

  handleSubmit = async event => {
    let attachment;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      await this.saveNote({
        inputOne: this.state.inputOne,
        inputTwo: this.state.inputTwo,
        inputThree: this.state.inputThree,
        attachment: attachment || this.state.note.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deleteNote() {
    return API.del("notes", `/notes/$(this.props.match.params.id)`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteNote();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Notes">
        {this.state.note &&
        <form onSubmit={this.handleSubmit}>
          <ListGroup varient="flush" controlId="viewNote">
            <h5 className="viewNoteHeader">
              <Moment format="MMMM Do YYYY">
                {this.state.createdDate}
              </Moment>
            </h5>
            <p>on this day, I was grateful for...</p>
            <ListGroupItem>- {this.state.inputOne}</ListGroupItem>
            <ListGroupItem>- {this.state.inputTwo}</ListGroupItem>
            <ListGroupItem>- {this.state.inputThree}</ListGroupItem>
          </ListGroup>
          {this.state.note.attachment &&
          <FormGroup>
            <ControlLabel>attachment</ControlLabel>
            <FormControl.Static>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={this.state.attachmentURL}
              >
                {this.formatFilename(this.state.note.attachment)}
              </a>
            </FormControl.Static>
          </FormGroup>}
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="save"
            loadingText="saving..."
          />
          <LoaderButton
            block
            bsStyle="danger"
            bsSize="large"
            isLoading={this.state.isDeleting}
            onClick={this.handleDelete}
            text="delete"
            loadingText="deleting..."
          />
        </form>}
      </div>
    );
  }
}