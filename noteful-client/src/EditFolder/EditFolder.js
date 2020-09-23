import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';

export default class editFolder extends Component {
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
  };

  // get Folder to be updated
  componentDidMount() {
    const { folderId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/folders/${folderId}`, {
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

  handleSubmit = (event) => {
    event.preventDefault();

    const { folderId } = this.props.match.params;
    const { id, name } = this.state;
    const newFolder = { id, name };

    fetch(config.API_ENDPOINT + `/folders/${folderId}`, {
      method: 'PATCH',
      body: JSON.stringify(newFolder),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));
      })
      .then(() => {
        this.resetFields(newFolder);
        this.context.updateFolder(newFolder);
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
    });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { error, name } = this.state;
    return (
      <section className="EditFolder">
        <h2>Edit Folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="EditFolder__error" role="alert">
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
