import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddNote.css';

const Required = () => <span className="AddBookmark__required">*</span>;

export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  static contextType = ApiContext;

  state = {
    error: null,
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, content, noteFolderId } = event.target;
    const note = {
      name: name.value,
      content: content.value,
      folder_id: noteFolderId.value,
      modified: new Date(),
    };
    this.setState({ error: null });
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(note),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((note) => {
        this.context.addNote(note);
        this.props.history.push(`/folders/${note.folder_id}`);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  render() {
    const { folders = [] } = this.context;
    const { error } = this.state;

    return (
      <section className="AddNote">
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="AddNote__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="note-name-input">
              Name
              <Required />
            </label>
            <input type="text" id="note-name-input" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea id="note-content-input" name="content" />
          </div>
          <div className="field">
            <label htmlFor="note-folder-select">
              Folder
              <Required />
            </label>
            <select id="note-folder-select" name="noteFolderId" required>
              <option value="">Select a folder...</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button type="submit">Add note</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}
