import { Button } from '../../ustc-ui/Button/Button';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import React from 'react';

export const FileEntryOfAppearanceReview = ({
  documentTitle,
  onBack,
  onCancel,
  onSubmit,
  pdfPreviewUrl,
  showModal,
}) => {
  return (
    <React.Fragment>
      <Focus>
        <h1
          className="heading-1 margin-bottom-0"
          id="file-a-document-header"
          tabIndex={-1}
        >
          Review Your Filing
        </h1>
      </Focus>

      <p className="full-width">
        You can’t edit your filing once you submit it. Please make sure your
        information appears the way you want it to.
      </p>
      <div className="grid-row grid-gap">
        <div className="grid-col">
          <WarningNotificationComponent
            alertWarning={{
              message:
                "Don't forget to check your document(s) to ensure personal information has been removed or redacted.",
            }}
            dismissible={false}
            scrollToTop={false}
          />

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="margin-bottom-4 grid-col-12">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined">Your Document(s)</h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col margin-bottom-1">
                        <div className="tablet:margin-bottom-0 margin-bottom-205">
                          <label className="usa-label" htmlFor="primary-filing">
                            {documentTitle}
                          </label>
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <a
                                href={pdfPreviewUrl}
                                rel="noreferrer"
                                target="_blank"
                              >
                                <FontAwesomeIcon
                                  className="fa-icon-blue"
                                  icon={['fas', 'file-pdf']}
                                />{' '}
                                {documentTitle}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-row grid-gap margin-bottom-5">
            <div className="tablet:grid-col-12 bg-white submit-reminders">
              <div className="card">
                <div className="content-header bg-accent-cool-dark text-white heading-3">
                  A Few Reminders Before You Submit
                </div>
                <div className="content-wrapper">
                  <ol className="numbered-list">
                    <li>
                      Double check that the PDF files you’ve selected are
                      correct.
                    </li>
                    <li>
                      Be sure you’ve removed or redacted all personal
                      information from your documents.
                    </li>
                    <li>
                      Indicate any related documents that you’ve included with
                      your filing.
                    </li>
                    <li>
                      Confirm everything appears as you want it to—you can’t
                      edit your filing after you submit it.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="margin-top-4">
                <Button
                  className="margin-bottom-1"
                  data-testid="submit-entry-of-appearance-button"
                  id="submit-document"
                  type="submit"
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  Submit Your Filing
                </Button>
                <Button secondary onClick={() => onBack()}>
                  Back
                </Button>
                <Button
                  link
                  onClick={() => {
                    onCancel();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        <NonMobile>
          <div
            className="grid-col padding-top-1"
            data-testid="entry-of-appearance-pdf-preview"
          >
            <PdfPreview heightOverride={true} />
          </div>
        </NonMobile>
      </div>

      {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
    </React.Fragment>
  );
};
