import React, { Component } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return API.get("notes", "/notes");
  }

  renderNotesList(notes) {
    return [{}].concat(notes).map(
      (note, i) =>
        i !== 0
          ? <LinkContainer
              key={note.noteId}
              to={`/notes/${note.noteId}`}
            >
              <ListGroupItem header={"Entry from " + new Date(note.createdAt).toLocaleString()}>
                {note.inputOne.trim().split("\n")[0] + "..."}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/notes/new"
            >
              <ListGroupItem
                className="createNew">
                <h4>
                  {"\uFF0B"} create a new entry...
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

  renderLander() {
    return(
      <div className="lander">
        <h1>what are you grateful for today?</h1>
        <p>be grateful.</p>
        <div>
          <Link to="/login" className="btn btn-lg">
            login
          </Link>
          <Link to="/signup" className="btn btn-lg">
            signup
          </Link>

        </div>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>your daily journal...</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}