/* eslint-disable react/prop-types */
import 'react-quill/dist/quill.snow.css';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import ReactQuill from 'react-quill';

export const TextEditor = connect(
  {
    form: state.form,
    onChange: sequences.updateFormValueSequence,
  },
  class TextEditorComponent extends React.Component {
    render() {
      return (
        <ReactQuill
          value={this.props.form.richText}
          onChange={e => {
            this.props.updateFormValueSequence({
              key: 'richText',
              value: e,
            });
          }}
        />
      );
    }
  },
);
