import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocument = connect(
  {
    caseDetail: state.formattedCaseDetail,
    form: state.form,
    selectDocumentSequence: sequences.selectDocumentSequence,
    submitting: state.submitting,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({ caseDetail, form }) => {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a
            href={`/case-detail/${
              caseDetail.docketNumber
            }/select-a-document-type`}
            id="queue-nav"
          >
            Back
          </a>
        </div>
        <section className="usa-section usa-grid">
          <CaseDetailHeader />
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />
          <h2 tabIndex="-1" id="file-a-document-header">
            File a Document
          </h2>
          <p>All fields required unless otherwise noted</p>
          <div>
            <h3 className="type-of-document">Type of Document You’re Filing</h3>
            <a
              href={`/case-detail/${
                caseDetail.docketNumber
              }/select-a-document-type`}
            >
              <FontAwesomeIcon icon="edit" size="sm" />
              Edit
            </a>
          </div>
          <div className="blue-container">
            <FontAwesomeIcon icon={['far', 'file-alt']} />
            <h4 className="file-name">Placeholder {form.documentTitle}</h4>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
