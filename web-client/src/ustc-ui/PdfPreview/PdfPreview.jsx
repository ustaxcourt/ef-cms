import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class PdfPreviewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.createURL();
  }

  componentWillUpdate() {
    console.log('in componentWillUpdate');
    this.releaseURL();
    this.createURL();
  }

  componentWillUnmount() {
    this.releaseURL();
  }

  releaseURL() {
    window.URL.revokeObjectURL(this.blobUrl);
  }

  createURL() {
    console.log('creating url');
    this.blobUrl = window.URL.createObjectURL(this.props.pdfFile);
    this.props.setPdfPreviewUrlSequence({ pdfUrl: this.blobUrl });
  }

  render() {
    console.log('in render', this.props.pdfPreviewUrl);
    return (
      this.props.pdfFile && (
        <>
          {this.props.pdfPreviewUrl && (
            <iframe
              id="pdf-preview-iframe"
              src={this.props.pdfPreviewUrl}
              title="PDF Preview"
            />
          )}
        </>
      )
    );
  }
}

PdfPreviewComponent.propTypes = {
  pdfFile: PropTypes.object,
  pdfPreviewUrl: PropTypes.string,
  setPdfPreviewUrlSequence: PropTypes.function,
};

export const PdfPreview = connect(
  {
    pdfFile: state.form.primaryDocumentFile,
    pdfPreviewUrl: state.pdfPreviewUrl,
    setPdfPreviewUrlSequence: sequences.setPdfPreviewUrlSequence,
  },
  PdfPreviewComponent,
);
