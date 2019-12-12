import { connect } from '@cerebral/react';
import { isEmpty } from 'lodash';
import { state } from 'cerebral';
import React from 'react';

export const MultiDocumentPartiesFilingReview = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ form, selectedCases }) => {
    return selectedCases.map(selectedCase => (
      <div
        className="tablet:grid-col-3 margin-bottom-5"
        key={selectedCase.caseId}
      >
        <label className="usa-label" htmlFor="filing-parties">
          {selectedCase.docketNumber} {selectedCase.caseName}
        </label>
        <ul className="ustc-unstyled-list without-margins">
          {!isEmpty(selectedCase.contactPrimary) && (
            <li>{selectedCase.contactPrimary.name}, Petitioner</li>
          )}
          {!isEmpty(selectedCase.contactSecondary) && (
            <li>{selectedCase.contactSecondary.name}, Petitioner</li>
          )}
          {form.partyRespondent && <li>Respondent</li>}
        </ul>
      </div>
    ));
  },
);
