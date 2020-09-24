import React from 'react';
import { Link } from 'react-router-dom';
// import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ApiContext from '../ApiContext';
import config from '../config';
import './Note.css';

export default class Note extends React.Component {
  static defaultProps = {
    onDeleteNote: () => {},
  };
  static contextType = ApiContext;

  handleClickDelete = (e) => {
    e.preventDefault();
    const note_id = this.props.id;

    fetch(`${config.API_ENDPOINT}/notes/${note_id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => Promise.reject(e));
        }
        this.context.deleteNote(note_id);
        this.props.onDeleteNote(note_id);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    const { name, id, modified } = this.props;

    return (
      <div className="Note">
        <h2 className="Note__title">
          <Link to={`/notes/${id}`}>{name}</Link>
        </h2>
        <Link to={`/edit/note/${id}`}>
          <button className="Note__edit" type="button">
            edit
          </button>
        </Link>{' '}
        <button
          className="Note__delete"
          type="button"
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon="trash-alt" /> remove
        </button>
        <div className="Note__dates">
          <div className="Note__dates-modified">
            Modified{' '}
            <span className="Date">
              {modified}
              {/* {format(new Date({ modified }), 'MM/dd/yyyy')} */}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
