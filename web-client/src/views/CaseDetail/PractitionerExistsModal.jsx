import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

class PractitionerExistsModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      classNames: 'ustc-counsel-exists-modal',
      confirmLabel: 'OK',
      title: 'Add Petitioner Counsel',
    };
  }

  renderBody() {
    const { caseDetailHelper } = this.props;

    return (
      <div>
        <div
          className={classNames(
            'bg-gold',
            'usa-form-group',
            'padding-1',
            'max-width-unset',
          )}
        >
          <div className="float-right text-italic padding-right-1">
            Counsel is already associated with this case.
          </div>
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="counsel-matches-legend">
              Counsel Match(es) Found
            </legend>

            {caseDetailHelper.practitionerSearchResultsCount === 1 && (
              <span>
                {caseDetailHelper.practitionerMatchesFormatted[0].name} (
                {caseDetailHelper.practitionerMatchesFormatted[0].barNumber}
                )
                <br />
                {caseDetailHelper.practitionerMatchesFormatted[0].cityStateZip}
              </span>
            )}
          </fieldset>
        </div>
        <div className="margin-bottom-3">
          You can make changes by selecting Edit from the Petitioner Counsel
          section.
        </div>
      </div>
    );
  }
}

export const PractitionerExistsModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetail: state.formattedCaseDetail,
    caseDetailHelper: state.caseDetailHelper,
    confirmSequence: sequences.clearModalSequence,
  },
  PractitionerExistsModalComponent,
);
