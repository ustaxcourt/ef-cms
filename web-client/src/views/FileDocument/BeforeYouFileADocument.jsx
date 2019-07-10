import { CaseDetailHeader } from '../CaseDetailHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const BeforeYouFileADocument = () => (
  <>
    <CaseDetailHeader />
    <section className="usa-section before-starting-case grid-container">
      <h1 className="captioned" tabIndex="-1">
        Before you file a document…
      </h1>

      <div className="grid-container padding-x-0" role="list">
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-6">
            <div className="caseItem" role="listitem">
              <div className="caseItem__icon" role="display">
                <FontAwesomeIcon icon={['far', 'copy']} />
              </div>
              <h3 className="caseItem__heading">
                1. Gather All Documents You Want to Include in Your Filing
              </h3>
              <div className="caseItem__content">
                <p>
                  You may have documents that are related or supporting the
                  primary document you wish to file. You should have all
                  documents you wish to file together available before you begin
                  the process.
                </p>

                <p>
                  <strong>Certificate of Service</strong>
                </p>
                <p>
                  If one or more of the parties in a consolidated group requires
                  paper service, you must include a certificate of service with
                  your document. In most cases, the only party petitioners will
                  need to serve is the IRS, and no certificate of service is
                  required. If you have a certificate of service, include it
                  with your main document in a single PDF file.
                </p>

                <p>
                  <strong>Supporting Documents</strong>
                </p>
                <p>
                  A supporting document is a document that supports and/or
                  provides depth to specific statements made in your primary
                  document. Affidavits, briefs, memorandums, and declarations
                  are all examples of supporting documents. If you want to file
                  one of these documents in support of your primary document,
                  you will be give the chance to do so during the filing
                  process.{' '}
                </p>

                <p>
                  <strong>Exhibits</strong>
                </p>
                <p>
                  An exhibit is evidence to be presented to the Court. If you
                  have an exhibit, include it with your main document in a
                  single PDF file. You may mail exhibits to the Court that
                  cannot be converted to a PDF format. For more information on
                  mailing exhibits, see the{' '}
                  <a
                    className="usa-link usa-link--external"
                    href="https://www.ustaxcourt.gov/eaccess/Petitioners_Guide_to_eAccess_and_eFiling.pdf"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Petitioner’s Guide to E-filing
                  </a>
                </p>

                <p>
                  <strong>Attachments</strong>
                </p>
                <p></p>
              </div>
            </div>
          </div>
          <div className="tablet:grid-col-6">
            <div className="caseItem" role="listitem">
              <div className="caseItem__icon" role="display">
                <FontAwesomeIcon icon={['fa', 'shield-alt']} />
              </div>
              <h3 className="caseItem__heading">
                2. Remove Personal Information From Your Document(s)
              </h3>
              <div className="caseItem__content">
                <p>
                  If your document(s) includes personal information (such as
                  Social Security Numbers, Taxpayer Identification Numbers, or
                  Employer Identification Numbers), remove or redact that
                  information before including it with your Petition. You can
                  remove this information by deleting it, marking through it so
                  it’s illegible, or any other method that will prevent it from
                  being seen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="button-box-container">
        <a className="usa-button margin-right-205" href="/start-a-case">
          Got It, Letʼs Start My Case
        </a>
        <a className="usa-button usa-button--outline" href="/">
          Cancel
        </a>
      </div>
    </section>
  </>
);
