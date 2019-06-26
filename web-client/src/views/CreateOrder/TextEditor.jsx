/* eslint-disable react/prop-types */
import 'react-quill/dist/quill.snow.css';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import ReactQuill, { Quill } from 'react-quill';

const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px'];
Quill.register(Size, true);

export const TextEditor = connect(
  {
    form: state.form,
    onChange: sequences.updateFormValueSequence,
  },
  class TextEditorComponent extends React.Component {
    render() {
      return (
        <ReactQuill
          formats={[
            'size',
            'bold',
            'italic',
            'underline',
            'bullet',
            'list',
            'indent',
          ]}
          modules={{
            toolbar: [
              [
                {
                  size: ['10px', '12px', '14px', '16px', '18px', '20px'],
                },
              ],
              ['bold', 'italic', 'underline'],
              [
                { list: 'bullet' },
                { list: 'ordered' },
                { indent: '-1' },
                { indent: '+1' },
              ],
            ],
          }}
          onChange={(content, delta, source, editor) => {
            const fullDelta = editor.getContents();
            const converter = new QuillDeltaToHtmlConverter(fullDelta.ops, {
              inlineStyles: true,
            });
            const html = converter.convert();
            this.props.updateFormValueSequence({
              key: 'richText',
              value: html,
            });
          }}
        />
      );
    }
  },
);
