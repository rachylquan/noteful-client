import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddFolder.css';

const Required = () => <span className="AddBookmark__required">*</span>;

export default class AddFolder extends Component {
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
    const folder = {
      name: event.target['folder-name'].value,
    };
    this.setState({ error: null });
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(folder),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((folder) => {
        this.context.addFolder(folder);
        this.props.history.push(`/folders/${folder.id}`);
      })
      .catch((error) => {
        console.error({ error });
        this.setState({ error });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <section className="AddFolder">
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="AddFolder__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="folder-name-input">
              Name
              <Required />
            </label>
            <input
              type="text"
              id="folder-name-input"
              name="folder-name"
              required
            />
          </div>
          <div className="buttons">
            <button type="submit">Add folder</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}
