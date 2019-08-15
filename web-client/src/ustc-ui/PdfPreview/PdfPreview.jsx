import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class PdfPreviewComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.releaseURL();
  }

  releaseURL() {
    this.props.clearPdfPreviewUrlSequence();
  }

  render() {
    if (!this.props.pdfPreviewUrl) return '';
    return (
      !process.env.CI && (
        <iframe
          id="pdf-preview-iframe"
          src={this.props.pdfPreviewUrl}
          title="PDF Preview"
        />
      )
    );
  }
}

PdfPreviewComponent.propTypes = {
  clearPdfPreviewUrlSequence: PropTypes.func,
  pdfPreviewUrl: PropTypes.string,
};

export const PdfPreview = connect(
  {
    clearPdfPreviewUrlSequence: sequences.clearPdfPreviewUrlSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  PdfPreviewComponent,
);
