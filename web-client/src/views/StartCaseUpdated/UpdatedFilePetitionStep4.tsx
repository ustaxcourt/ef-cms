import { Button } from '@web-client/ustc-ui/Button/Button';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { PROCEDURE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { ProcedureType } from '@web-client/views/StartCase/ProcedureType';
import { TrialCity } from '@web-client/views/StartCase/TrialCity';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetitionStep4 = connect(
  {
    deleteValidationErrorMessageSequence:
      sequences.deleteValidationErrorMessageSequence,
    form: state.form,
    petitionGenerationLiveValidationSequence:
      sequences.petitionGenerationLiveValidationSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function UpdatedFilePetitionStep4({
    deleteValidationErrorMessageSequence,
    form,
    petitionGenerationLiveValidationSequence,
    updateFormValueSequence,
  }) {
    return (
      <>
        <div className="margin-bottom-5">
          <p className="margin-top-0 required-statement">
            *All fields required
          </p>
          <h2 style={{ marginBottom: '8px' }}>Case procedure</h2>
          <div
            className="maxw-none"
            style={{
              fontSize: '18px',
              lineHeight: '1.5',
              paddingBottom: '10px',
            }}
          >
            If your case qualifies, you may choose to have it handled as a small
            tax case. The Court handles small tax cases differently.
          </div>
          <Button
            link
            className="usa-link--external text-left mobile-text-wrap"
            href="https://ustaxcourt.gov/case_procedure.html"
            overrideMargin="margin-right-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            Which case procedure should I choose?{' '}
            <Icon
              className="fa-icon-blue"
              icon={['fa-soli', 'fa-arrow-up-right-from-square']}
              size="1x"
            />
          </Button>

          <div className="margin-top-3">
            <ProcedureType
              legend="Select case procedure"
              value={form.procedureType}
              onChange={e => {
                updateFormValueSequence({
                  key: 'procedureType',
                  value: e.target.value,
                });

                deleteValidationErrorMessageSequence({
                  validationKey: ['procedureType'],
                });

                form.preferredTrialCity = '';
              }}
            />
          </div>
          {form.procedureType && (
            <div>
              <h2 style={{ marginBottom: '8px' }}>
                U.S. Tax Court trial locations
              </h2>
              <div
                className="max-width-900"
                style={{
                  fontSize: '18px',
                  lineHeight: '1.5',
                  paddingBottom: '10px',
                }}
              >
                {form.procedureType === PROCEDURE_TYPES_MAP.regular
                  ? `This is your preferred location where your case may be heard if
                it goes to trial. Trial locations are unavailable in the
                following states: DE, KS, ME, NH, NJ, ND, RI, SD, VT, WY.`
                  : `This is your preferred location where your case may be heard if
                it goes to trial. Trial locations are unavailable in the
                following states:  DE, NH, NJ, RI.`}
                <span>
                  {' '}
                  <Button
                    link
                    className="usa-link--external text-left mobile-text-wrap"
                    href="https://www.ustaxcourt.gov/dpt_cities.html"
                    overrideMargin="margin-right-1"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Trial locations
                    <Icon
                      className="fa-icon-blue"
                      icon={['fa-soli', 'fa-arrow-up-right-from-square']}
                      size="1x"
                    />
                  </Button>
                </span>
              </div>
              <TrialCity
                label="Preferred trial location"
                procedureType={form.procedureType}
                showDefaultOption={true}
                value={form.preferredTrialCity || ''}
                onBlur={() => {
                  petitionGenerationLiveValidationSequence({
                    validationKey: ['preferredTrialCity'],
                  });
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value || null,
                  });

                  deleteValidationErrorMessageSequence({
                    validationKey: ['preferredTrialCity'],
                  });
                }}
              />
            </div>
          )}
        </div>
        <div>
          <UpdatedFilePetitionButtons></UpdatedFilePetitionButtons>
        </div>
      </>
    );
  },
);
