import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { TextField } from '@web-client/dawson-ui/ui/input';
import React from 'react';

type CaseSearchByDocketNumberProps = {
  submitDocketNumberSearchSequence: Function
}

export const CaseSearchByDocketNumber: React.FC<CaseSearchByDocketNumberProps> = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validateCaseDocketNumberSearchFormSequence:
      sequences.validateCaseDocketNumberSearchFormSequence,
    validationErrors: state.validationErrors,
  },
  function CaseSearchByDocketNumber({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    submitDocketNumberSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validateCaseDocketNumberSearchFormSequence,
    validationErrors,
  }: {
    advancedSearchForm: { caseSearchByDocketNumber: { docketNumber?: string } };
    clearAdvancedSearchFormSequence: Function;
    submitDocketNumberSearchSequence: Function;
    updateAdvancedSearchFormValueSequence: Function;
    validateCaseDocketNumberSearchFormSequence: Function;
    validationErrors: { docketNumber?: string };
  }) {
    return (
      <>
        <div
          className="header-with-blue-background display-flex flex-justify"
          id="search-by-docket-number"
        >
          <h3>Search by Docket Number</h3>
        </div>
        <div className="blue-container display-flex flex-column height-full">
          <form>
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <FormGroup errorText={validationErrors.docketNumber}>
                  <div className="max-xs:tw:w-full tw:mt-4">
                    <TextField
                      aria-describedby="search-by-docket-number"
                      data-testid="docket-number"
                      id="docket-number"
                      name="docketNumber"
                      icon={false}
                      label="Docket number"
                      helpText="Example of docket number format: 123-19"
                      placeholder=""
                      required={true}
                      value={
                        advancedSearchForm.caseSearchByDocketNumber
                          .docketNumber || ''
                      }
                      onBlur={() => {
                        validateCaseDocketNumberSearchFormSequence();
                      }}
                      onChange={e => {
                        updateAdvancedSearchFormValueSequence({
                          formType: 'caseSearchByDocketNumber',
                          key: e.target.name,
                          value: e.target.value.toUpperCase(),
                        });
                      }}
                    />
                  </div>
                </FormGroup>
              </div>
            </div>

            <div className="grid-row">
              <div className="button-container">
                <Button
                  overrideMargin
                  aria-describedby="search-by-docket-number"
                  className="margin-bottom-0"
                  data-testid="docket-search-button"
                  id="docket-search-button"
                  onClick={e => {
                    e.preventDefault();
                    submitDocketNumberSearchSequence();
                  }}
                >
                  Search
                </Button>
                <Button
                  link
                  overrideMargin
                  aria-describedby="search-by-docket-number"
                  className="margin-bottom-0 mobile:margin-top-2 tablet:margin-top-0 tablet:margin-left-205"
                  onClick={e => {
                    e.preventDefault();
                    clearAdvancedSearchFormSequence({
                      formType: 'caseSearchByDocketNumber',
                    });
                  }}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);

CaseSearchByDocketNumber.displayName = 'CaseSearchByDocketNumber';
