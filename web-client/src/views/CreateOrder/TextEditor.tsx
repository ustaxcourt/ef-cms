/* eslint-disable react/prop-types */
import 'react-quill/dist/quill.snow.css';
import { DomUtils, parseDocument } from 'htmlparser2';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { render as renderHtml } from 'dom-serializer';
import React, { Suspense, useEffect, useRef } from 'react';
import reactQuill from 'react-quill';

const inlineStylesFontSizes = {};
const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px'];

const ReactQuill = React.lazy(async () => {
  const Size = await reactQuill.Quill.import('attributors/style/size');
  Size.whitelist = fontSizes;
  reactQuill.Quill.register(Size, true);

  fontSizes.forEach(item => {
    inlineStylesFontSizes[item] = `font-size: ${item};`;
  });

  return { default: reactQuill };
});

// Quill does two things to render indentations:
// 1) Adds padding-left so that the richText (and therefore the pdf) has indentations.
// 2) Adds custom ql-indent-{level} classes to display the indentation in the Quill editor itself.
// As part of the richText, 1 is automatically preserved across save and reload.
// As part of the client-side Quill text rendering, 2 is *not* preserved across save and reload,
// so even though the indentations are "there" in the richText, the user won't see them in the editor.
// We call addQuillIndentationClasses on loading the text into the editor in order to correct that.
const addQuillIndentationClasses = (html: string) => {
  const dom = parseDocument(html);
  // Traverse the DOM and add the appropriate ql-indent-{level} class corresponding to any elements with padding-left
  DomUtils.findAll(elem => {
    if (elem.name === 'p' && elem.attribs && elem.attribs.style) {
      const { style } = elem.attribs;
      const paddingLeftMatch = style.match(/padding-left:([0-9]+)em/);
      if (paddingLeftMatch) {
        const paddingLeftValue = parseInt(paddingLeftMatch[1]);
        const indentLevel = paddingLeftValue / 3;
        elem.attribs.class = `ql-indent-${indentLevel}`;
      }
    }
    return true;
  }, dom.children);

  return renderHtml(dom);
};

export const TextEditor = ({
  defaultValue,
  editorDelta,
  updateFormValueSequence,
  updateScreenMetadataSequence,
}) => {
  const quillEscapeRef = useRef(null);
  defaultValue = addQuillIndentationClasses(defaultValue);

  const onKeyboard = event => {
    const pressedESC = event.keyCode === 27;
    const inEditor = event.target.classList.contains('ql-editor');
    if (pressedESC && inEditor) {
      quillEscapeRef.current.focus();
    }
  };

  const addKeyboardListeners = () => {
    window.document.addEventListener('keydown', onKeyboard, false);
  };
  const removeKeyboardListeners = () => {
    window.document.removeEventListener('keydown', onKeyboard, false);
  };

  useEffect(() => {
    addKeyboardListeners();
    return () => removeKeyboardListeners();
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ReactQuill
          defaultValue={editorDelta || defaultValue}
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
              // We add custom CSS styles to maintain tabbing across save and reload.
              // (Note that preserveWhitespace does not work: https://github.com/ustaxcourt/ef-cms/pull/1408.)
              customCssStyles: () => {
                return 'white-space: pre-wrap !important';
              },
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
              key: 'editorDelta',
              value: fullDelta,
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
          tabIndex={-1}
        />
      </Suspense>
    </>
  );
};

TextEditor.displayName = 'TextEditor';
