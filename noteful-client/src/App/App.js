import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import EditNote from '../EditNote/EditNote';
import EditFolder from '../EditFolder/EditFolder';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import ApiContext from '../ApiContext';
import config from '../config';
import './App.css';

class App extends Component {
  state = {
    notes: [],
    folders: [],
    error: null,
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`),
    ])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok) {
          return notesRes.json().then((error) => Promise.reject(error));
        }
        if (!foldersRes.ok) {
          return foldersRes.json().then((error) => Promise.reject(error));
        }
        return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders, error: null });
      })
      .catch((error) => {
        console.error({ error });
        this.setState({ error });
      });
  }

  handleAddFolder = (folder) => {
    this.setState({
      folders: [...this.state.folders, folder],
    });
  };

  handleAddNote = (note) => {
    this.setState({
      notes: [...this.state.notes, note],
    });
  };

  handleDeleteNote = (noteId) => {
    this.setState({
      notes: this.state.notes.filter((note) => note.id !== noteId),
    });
  };

  handleUpdateNote = (updatedNote) => {
    this.setState({
      notes: this.state.notes.map((note) =>
        note.id !== updatedNote.id ? note : updatedNote
      ),
    });
  };

  handleUpdateFolder = (updatedFolder) => {
    this.setState({
      folders: this.state.folders.map((folder) =>
        folder.id !== updatedFolder.id ? folder : updatedFolder
      ),
    });
  };

  renderNavRoutes() {
    return (
      <>
        {['/', '/folders/:folderId'].map((path) => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route path="/notes/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folders/:folderId'].map((path) => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/notes/:noteId" component={NotePageMain} />
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note" component={AddNote} />
        <Route path="/edit/note/:noteId" component={EditNote} />
        <Route path="/edit/folder/:folderId" component={EditFolder} />
      </>
    );
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote,
      deleteNote: this.handleDeleteNote,
      updateNote: this.handleUpdateNote,
      updateFolder: this.handleUpdateFolder,
    };
    return (
      <ApiContext.Provider value={value}>
        <div className="App">
          <nav className="App__nav">{this.renderNavRoutes()}</nav>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{' '}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <main className="App__main">{this.renderMainRoutes()}</main>
        </div>
      </ApiContext.Provider>
    );
  }
}

export default App;
