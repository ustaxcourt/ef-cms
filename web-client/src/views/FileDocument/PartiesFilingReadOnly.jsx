import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesFilingReadOnly = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    form: state.form,
  },
  ({ chooseWizardStepSequence, caseDetail, form }) => {
    return (
      <React.Fragment>
        <h3 className="header-with-link-button">
          Parties Filing This Document
        </h3>
        <button
          className="link push-right"
          type="button"
          onClick={() => chooseWizardStepSequence({ value: 'FileDocument' })}
        >
          <FontAwesomeIcon icon="edit" size="sm" />
          Edit
        </button>
        <div className="blue-container">
          <div className="ustc-form-group">
            <label htmlFor="filing-parties">Filing Parties</label>
            <ul className="ustc-unstyled-list without-margins">
              {form.partyPrimary && <li>Myself</li>}
              {form.partySecondary && (
                <li>${caseDetail.contactSecondary.name}</li>
              )}
              {form.partyRespondent && <li>Respondent</li>}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
