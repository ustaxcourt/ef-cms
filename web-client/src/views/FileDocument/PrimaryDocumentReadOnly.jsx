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
          <h1>PDF.js Previous/Next example</h1>

          <div>
            <button id="prev">Previous</button>
            <button id="next">Next</button>
            &nbsp; &nbsp;
            <span>Page: <span id="page_num"></span> / <span id="page_count"></span></span>
          </div>
          
          <canvas id="the-canvas"></canvas>
          <script src="http://localhost:1234/pdf.min.js"></script>
        </head>

        <body>
          <h1>TEST</h1>
          <script>
            var pdfData = atob("${base64}");
            // Loaded via <script> tag, create shortcut to access PDF.js exports.
            var pdfjsLib = window['pdfjs-dist/build/pdf'];

            // The workerSrc property shall be specified.
            pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

            var pdfDoc = null,
                pageNum = 1,
                pageRendering = false,
                pageNumPending = null,
                scale = 0.8,
                canvas = document.getElementById('the-canvas'),
                ctx = canvas.getContext('2d');

            /**
             * Get page info from document, resize canvas accordingly, and render page.
             * @param num Page number.
             */
            function renderPage(num) {
              pageRendering = true;
              // Using promise to fetch the page
              pdfDoc.getPage(num).then(function(page) {
                var viewport = page.getViewport({scale: scale});
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                  canvasContext: ctx,
                  viewport: viewport
                };
                var renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.promise.then(function() {
                  pageRendering = false;
                  if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                  }
                });
              });

              // Update page counters
              document.getElementById('page_num').textContent = num;
            }

            /**
             * If another page rendering in progress, waits until the rendering is
             * finised. Otherwise, executes rendering immediately.
             */
            function queueRenderPage(num) {
              if (pageRendering) {
                pageNumPending = num;
              } else {
                renderPage(num);
              }
            }

            /**
             * Displays previous page.
             */
            function onPrevPage() {
              if (pageNum <= 1) {
                return;
              }
              pageNum--;
              queueRenderPage(pageNum);
            }
            document.getElementById('prev').addEventListener('click', onPrevPage);

            /**
             * Displays next page.
             */
            function onNextPage() {
              if (pageNum >= pdfDoc.numPages) {
                return;
              }
              pageNum++;
              queueRenderPage(pageNum);
            }
            document.getElementById('next').addEventListener('click', onNextPage);

            /**
             * Asynchronously downloads PDF.
             */
            pdfjsLib.getDocument({ data: pdfData}).promise.then(function(pdfDoc_) {
              pdfDoc = pdfDoc_;
              document.getElementById('page_count').textContent = pdfDoc.numPages;

              // Initial/first page rendering
              renderPage(pageNum);
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
