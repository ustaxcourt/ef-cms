import { Editor, EditorState, RichUtils } from 'draft-js';
import React from 'react';

export class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
    this.setEditor = editor => {
      this.editor = editor;
    };
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };
  }

  componentDidMount() {
    this.focusEditor();
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    return (
      <div style={styles.editor} onClick={this.focusEditor}>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>{' '}
        <Editor
          editorState={this.state.editorState}
          ref={this.setEditor}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '10em',
  },
};
