import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';

export default class editNote extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = ApiContext;

  state = {
    error: null,
    id: '',
    name: '',
    content: '',
    folder_id: '',
  };

  // get note to be updated
  componentDidMount() {
    const { noteId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/notes/${noteId}`, {
      method: 'GET',
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));

        return res.json();
      })
      .then((responseData) => {
        this.setState({
          id: responseData.id,
          name: responseData.name,
          content: responseData.content,
          folder_id: responseData.folder_id,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error });
      });
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  handleChangeContent = (event) => {
    this.setState({ content: event.target.value });
  };

  handleChangeFolderId = (event) => {
    this.setState({ folder_id: parseInt(event.target.value) });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { noteId } = this.props.match.params;
    const { id, name, content, folder_id } = this.state;
    const newNote = { id, name, content, folder_id };

    fetch(config.API_ENDPOINT + `/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(newNote),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));
      })
      .then(() => {
        this.resetFields(newNote);
        this.context.updateNote(newNote);
        this.props.history.push('/');
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || undefined,
      name: newFields.name || '',
      content: newFields.content || '',
      folder_id: newFields.folder_id || 3,
    });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { folders = [] } = this.context;
    const { error, name, content, folder_id } = this.state;
    return (
      <section className="EditNote">
        <h2>Edit Note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="EditNote__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <input type="hidden" name="id" />
          <div className="field">
            <label htmlFor="name">Name </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="name"
              required
              value={name}
              onChange={this.handleChangeName}
            />
          </div>
          <div className="field">
            <label htmlFor="content">Content </label>
            <textarea
              id="content"
              name="content"
              type="text"
              placeholder="content"
              value={content}
              onChange={this.handleChangeContent}
            />
          </div>
          <div className="field">
            <label htmlFor="folder_id">Folder</label>
            <select
              id="folder_id"
              name="folder_id"
              aria-label="Folder Id"
              required
              aria-required="true"
              aria-invalid="true"
              value={folder_id}
              onChange={this.handleChangeFolderId}
            >
              <option value="">Select a folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{' '}
            <button type="submit">Save</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}
