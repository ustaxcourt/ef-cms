/* eslint-disable react/prop-types */
import 'react-quill/dist/quill.snow.css';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import React, { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';

const Size = Quill.import('attributors/style/size');
const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px'];
Size.whitelist = fontSizes;
Quill.register(Size, true);

export const TextEditor = ({
  defaultValue,
  updateFormValueSequence,
  updateScreenMetadataSequence,
}) => {
  const inlineStylesFontSizes = {};
  const quillEscapeRef = useRef(null);

  const onKeyboard = event => {
    const pressedESC = event.keyCode === 27;
    const inEditor = event.target.classList.contains('ql-editor');
    if (pressedESC && inEditor) {
      quillEscapeRef.current.focus();
    }
  };

  const addKeyboardListeners = () => {
    document.addEventListener('keydown', onKeyboard, false);
  };
  const removeKeyboardListeners = () => {
    document.removeEventListener('keydown', onKeyboard, false);
  };

  useEffect(() => {
    addKeyboardListeners();
    return () => removeKeyboardListeners();
  }, []);

  fontSizes.forEach(item => {
    inlineStylesFontSizes[item] = `font-size: ${item};`;
  });

  return (
    <>
      <ReactQuill
        defaultValue={defaultValue}
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
        tabIndex={0}
        onChange={(content, delta, source, editor) => {
          const fullDelta = editor.getContents();
          const documentContents = editor.getText();
          const converter = new QuillDeltaToHtmlConverter(fullDelta.ops, {
            inlineStyles: {
              size: inlineStylesFontSizes,
            },
          });
          const html = converter.convert();
          updateFormValueSequence({
            key: 'richText',
            value: html,
          });
          updateFormValueSequence({
            key: 'documentContents',
            value: documentContents,
          });
          updateScreenMetadataSequence({
            key: 'pristine',
            value: false,
          });
        }}
      />
      <button
        aria-hidden
        className="usa-sr-only"
        id="escape-focus-for-keyboard"
        ref={quillEscapeRef}
        tabIndex="-1"
      />
    </>
  );
};
