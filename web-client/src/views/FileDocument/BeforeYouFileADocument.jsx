import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const BeforeYouFileADocument = connect(
  {
    caseDetail: state.caseDetail,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
  },
  function BeforeYouFileADocument({
    caseDetail,
    formCancelToggleCancelSequence,
    showModal,
  }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section before-filing-document grid-container">
          <h2 className="captioned" tabIndex="-1">
            Before You File a Document…
          </h2>

          <div className="grid-container padding-x-0" role="list">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <div className="caseItem" role="listitem">
                  <NonMobile>
                    <div className="caseItem__icon" role="display">
                      <FontAwesomeIcon icon={['far', 'copy']} />
                    </div>
                  </NonMobile>
                  <h3 className="caseItem__heading">
                    1. Gather All Documents You Want to Include in Your Filing
                  </h3>
                  <div className="caseItem__content">
                    <p>
                      You may have documents that are related or supporting the
                      primary document you wish to file. You should have all
                      documents you wish to file together available before you
                      begin the process.
                    </p>

                    <p className="label">Certificate of Service</p>
                    <p>
                      If one or more of the parties in a consolidated group
                      requires paper service, you must include a certificate of
                      service with your document. In most cases, the only party
                      petitioners will need to serve is the IRS, and no
                      certificate of service is required. If you have a
                      certificate of service, include it with your main document
                      in a single PDF file.
                    </p>

                    <p className="label">Supporting documents</p>
                    <p>
                      A supporting document is a document that supports and/or
                      provides depth to specific statements made in your primary
                      document. Affidavits, briefs, memorandums, and
                      declarations are all examples of supporting documents. If
                      you want to file one of these documents in support of your
                      primary document, you will be give the chance to do so
                      during the filing process.{' '}
                    </p>

                    <p className="label">Attachments</p>
                    <p>
                      An attachment is any other document you are submitting
                      with your filing. If you have an attachment, include it
                      with your main document in a single PDF file. You may mail
                      exhibits to the Court that cannot be converted to a PDF
                      format. For more information on mailing exhibits, see the{' '}
                      <a
                        className="usa-link--external"
                        href="https://ustaxcourt.gov/resources/dawson/DAWSON_Petitioner_Training_Guide.pdf"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Petitioner’s Guide to E-filing
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col-6">
                <div className="caseItem" role="listitem">
                  <NonMobile>
                    <div className="caseItem__icon" role="display">
                      <FontAwesomeIcon icon={['fa', 'shield-alt']} />
                    </div>
                  </NonMobile>
                  <h3 className="caseItem__heading">
                    2. Remove Personal Information From Your Document(s)
                  </h3>
                  <div className="caseItem__content">
                    <p>
                      If your document(s) includes personal information (such as
                      Social Security Numbers, Taxpayer Identification Numbers,
                      or Employer Identification Numbers), remove or redact that
                      information before including it with your Petition. You
                      can remove this information by deleting it, marking
                      through it so it’s illegible, or any other method that
                      will prevent it from being seen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            href={`/case-detail/${caseDetail.docketNumber}/file-a-document`}
          >
            OK, Iʼm Ready to File
          </Button>
          <Button
            link
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </Button>
          {showModal === 'FormCancelModalDialog' && (
            <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
          )}
        </section>
      </>
    );
  },
);
