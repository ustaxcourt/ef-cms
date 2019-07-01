/* eslint-disable react/prop-types */
import 'react-quill/dist/quill.snow.css';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import ReactQuill, { Quill } from 'react-quill';

const Size = Quill.import('attributors/style/size');
const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px'];
Size.whitelist = fontSizes;
Quill.register(Size, true);

export const TextEditor = connect(
  {
    form: state.form,
    onChange: sequences.updateFormValueSequence,
  },
  class TextEditorComponent extends React.Component {
    render() {
      const inlineStylesFontSizes = {};

      fontSizes.forEach(item => {
        inlineStylesFontSizes[item] = `font-size: ${item};`;
      });

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
                  size: fontSizes,
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
              inlineStyles: {
                size: inlineStylesFontSizes,
              },
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
