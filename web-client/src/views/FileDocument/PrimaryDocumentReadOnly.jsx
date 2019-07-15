import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrimaryDocumentReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ chooseWizardStepSequence, fileDocumentHelper, form }) => {
    const renderPdfViewer = pdfData => {
      console.log('pdfData', pdfData);
      const base64 = pdfData.replace('data:application/pdf;base64,', '');
      console.log('base64', base64);
      return `
      <html>
        <head>
          <canvas id="the-canvas"></canvas>
          <script src="http://localhost:1234/pdf.min.js"></script>
        </head>

        <body>
          <h1>TEST</h1>
          <script>
            var pdfData = atob("${base64}");
            var pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'http://localhost:1234/pdf.worker.min.js';
            var loadingTask = pdfjsLib.getDocument({data: pdfData});
            loadingTask.promise.then(function(pdf) {
              var pageNumber = 1;
              pdf.getPage(pageNumber).then(function(page) {
                var scale = 1.5;
                var viewport = page.getViewport({scale: scale});
                var canvas = document.getElementById('the-canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                  console.log('Page rendered');
                });
              });
            }, function (reason) {
              // PDF loading error
              console.error(reason);
            });
          </script>
        </body>
      </html>
      `;
    };
    return (
      <React.Fragment>
        <div>
          <h2 className="header-with-link-button">
            {form.documentTitle}{' '}
            <button
              className="usa-button usa-button--unstyled margin-left-205"
              type="button"
              onClick={() =>
                chooseWizardStepSequence({ value: 'FileDocument' })
              }
            >
              <FontAwesomeIcon icon="edit" size="sm" />
              Edit
            </button>
          </h2>
        </div>

        <div className="blue-container">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="primary-filing">
              {form.documentTitle}
            </label>
            <FontAwesomeIcon icon={['fas', 'file-pdf']} />
            <button
              type="button"
              onClick={() => {
                const convertFileToBase64AndOpenInTab = file => {
                  console.log('file', file);
                  var reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = function() {
                    const pdfData = reader.result;
                    const previewWindow = window.open();
                    previewWindow.document.write(renderPdfViewer(pdfData));
                  };
                  reader.onerror = function(error) {
                    console.log('Error: ', error);
                  };
                };

                convertFileToBase64AndOpenInTab(form.primaryDocumentFile);
              }}
            >
              {form.primaryDocumentFile.name}
            </button>
          </div>

          {form.supportingDocumentFile && (
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="supporting-documents">
                {form.supportingDocumentMetadata.documentTitle}
              </label>
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              {form.supportingDocumentFile.name}
            </div>
          )}

          {fileDocumentHelper.showFilingIncludes && (
            <div
              className={`usa-form-group ${
                !fileDocumentHelper.showObjection ? 'margin-bottom-0' : ''
              }`}
            >
              <label className="usa-label" htmlFor="filing-includes">
                Filing Includes
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {form.certificateOfServiceDate && (
                  <li>
                    Certificate of Service{' '}
                    {fileDocumentHelper.certificateOfServiceDateFormatted}
                  </li>
                )}
                {form.exhibits && <li>Exhibit(s)</li>}
                {form.attachments && <li>Attachment(s)</li>}
              </ul>
            </div>
          )}

          {fileDocumentHelper.showFilingNotIncludes && (
            <div
              className={`usa-form-group ${
                !fileDocumentHelper.showObjection ? 'margin-bottom-0' : ''
              }`}
            >
              <label className="usa-label" htmlFor="filing-not-includes">
                Filing Does Not Include
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {!form.certificateOfService && <li>Certificate of Service</li>}
                {!form.exhibits && <li>Exhibit(s)</li>}
                {!form.attachments && <li>Attachment(s)</li>}
                {!form.hasSupportingDocuments && <li>Supporting Documents</li>}
              </ul>
            </div>
          )}

          {fileDocumentHelper.showObjection && (
            <div className="usa-form-group margin-bottom-0">
              <label className="usa-label" htmlFor="objections">
                Are There Any Objections to This Document?
              </label>
              {form.objections}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
