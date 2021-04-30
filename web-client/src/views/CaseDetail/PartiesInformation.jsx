import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

const PartiesInformation = connect({}, function PartiesInformation() {
  return (
    <>
      <div className="grid-row grid-gap-5">
        <div className="grid-col-3">
          <div className="border border-base-lighter">
            <div className="grid-row padding-left-205 grid-header">
              Parties & Counsel
            </div>
            <div className="">
              <Button
                className={classNames(
                  'usa-button--unstyled attachment-viewer-button',
                )}
              >
                <div className="grid-row margin-left-205">
                  Petitioner(s) & Counsel
                </div>
              </Button>
              <Button
                className={classNames(
                  'usa-button--unstyled attachment-viewer-button',
                )}
              >
                <div className="grid-row margin-left-205">
                  Intervenor/Participants & Counsel
                </div>
              </Button>
              <Button
                className={classNames(
                  'usa-button--unstyled attachment-viewer-button',
                )}
              >
                <div className="grid-row margin-left-205">
                  Respondent Counsel
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="grid-col-9">
          <div className="grid-row">
            <div className="grid-col-4">
              <h3>Petitioner(s)</h3>
            </div>
            <div className="grid-col-2">
              <div className="text-right">
                <span
                  className="label margin-right-4 margin-top-05"
                  id="practitioner-counsel-search-description"
                >
                  Add counsel
                </span>
              </div>
            </div>
            <div className="grid-col-4">
              <FormGroup
                className="margin-bottom-0 margin-top-0"
                // errorText={validationErrors.practitionerSearchError}
              >
                <form
                  className="usa-search"
                  onSubmit={e => {
                    e.preventDefault();
                    // openAddPrivatePractitionerModalSequence();
                  }}
                >
                  <div role="search">
                    <label
                      className="usa-sr-only"
                      htmlFor="practitioner-search-field"
                    >
                      Search
                    </label>
                    <input
                      aria-describedby="practitioner-counsel-search-description"
                      className={classNames(
                        'usa-input margin-bottom-0',
                        // validationErrors.practitionerSearchError &&
                        //   'usa-input--error',
                      )}
                      id="practitioner-search-field"
                      name="practitionerSearch"
                      placeholder="Enter bar no. or name"
                      type="search"
                      // value={form.practitionerSearch || ''}
                    />
                    <button
                      className="small-search-button usa-button"
                      id="search-for-practitioner"
                      type="submit"
                    >
                      <span className="usa-search__submit-text">Search</span>
                    </button>
                  </div>
                </form>
              </FormGroup>
            </div>
            <div className="grid-col-2">
              <Button link className="float-right" icon="plus-circle">
                Add Party
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export { PartiesInformation };
