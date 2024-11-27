import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MinuteSheetFormState } from '@web-client/presenter/state/minuteSheetFormState';
import React from 'react';

export const CaseMetadataFieldset = ({
  caseMetadataFormState,
  onBlurHandler,
  onChangeHandler,
}: {
  onChangeHandler: ({
    name,
    section,
    value,
  }: {
    name: string;
    section: string;
    value: string | boolean;
  }) => void;
  onBlurHandler: () => void;
  caseMetadataFormState: MinuteSheetFormState['caseMetadata'];
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-2">
          <span className="usa-label margin-bottom-0">Called</span>
        </div>
        <div className="grid-col-2">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="calledDate"
            label="Date"
            labelPosition="left"
            onChange={e =>
              onChangeHandler({
                name: e.target.name,
                value: e.target.value,
                section: 'caseMetadata',
              })
            }
          />
        </div>
        <div className="grid-col-6">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="calledNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block maxw-full"
              id="calledNote"
              name="calledNote"
              type="text"
              value={caseMetadataFormState.called.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'caseMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={caseMetadataFormState.called.transcriptOrdered}
                className="usa-checkbox__input"
                id="calledTranscriptOrdered"
                name="calledTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: e.target.name,
                    value: e.target.checked,
                    section: 'caseMetadata',
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="calledTranscriptOrdered"
              >
                Transcript ordered
              </label>
            </div>
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-2">
          <span className="usa-label margin-bottom-0">Not Called</span>
        </div>
        <div className="grid-col-2">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="notCalledDate"
            label="Date"
            labelPosition="left"
            onChange={e =>
              onChangeHandler({
                name: e.target.name,
                value: e.target.value,
                section: 'caseMetadata',
              })
            }
          />
        </div>
        <div className="grid-col-6">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="notCalledNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block maxw-full"
              id="notCalledNote"
              name="notCalledNote"
              type="text"
              value={caseMetadataFormState.notCalled.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'caseMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2"></div>
      </div>
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        {/* TODO 10419 Need to update onChange handling to support recalled being a nested structure, multiple rows. */}
        <div className="grid-col-2">
          <span className="usa-label margin-bottom-0">Re-called</span>
        </div>
        <div className="grid-col-2">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="reCalledDate"
            label="Date(s)"
            labelPosition="left"
            onChange={e =>
              onChangeHandler({
                name: e.target.name,
                value: e.target.value,
                section: 'caseMetadata',
              })
            }
          />
        </div>
        <div className="grid-col-6">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="reCalledNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block maxw-full"
              id="reCalledNote"
              name="reCalledNote"
              type="text"
              value={caseMetadataFormState.recalled[0]?.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'caseMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={caseMetadataFormState.recalled[0]?.transcriptOrdered}
                className="usa-checkbox__input"
                id="reCalledTranscriptOrdered"
                name="reCalledTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: e.target.name,
                    value: e.target.checked,
                    section: 'caseMetadata',
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="reCalledTranscriptOrdered"
              >
                Transcript ordered
              </label>
            </div>
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-2">
          <span className="usa-label margin-bottom-0">Pretrial conference</span>
        </div>
        <div className="grid-col-2">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="pretrialConferenceDate"
            label="Date(s)"
            labelPosition="left"
            onChange={e =>
              onChangeHandler({
                name: e.target.name,
                value: e.target.value,
                section: 'caseMetadata',
              })
            }
          />
        </div>
        <div className="grid-col-6">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="pretrialConferenceNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block maxw-full"
              id="pretrialConferenceNote"
              name="pretrialConferenceNote"
              type="text"
              value={caseMetadataFormState.pretrialConference.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'caseMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={
                  caseMetadataFormState.pretrialConference.transcriptOrdered
                }
                className="usa-checkbox__input"
                id="pretrialConferenceTranscriptOrdered"
                name="pretrialConferenceTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: e.target.name,
                    value: e.target.checked,
                    section: 'caseMetadata',
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="pretrialConferenceTranscriptOrdered"
              >
                Transcript ordered
              </label>
            </div>
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap align-items-center">
        <div className="grid-col-2">
          <span className="usa-label margin-bottom-0">Trial/Hearing</span>
        </div>
        <div className="grid-col-2">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="trialHearingDate"
            label="Date(s)"
            labelPosition="left"
            onChange={e =>
              onChangeHandler({
                name: e.target.name,
                value: e.target.value,
                section: 'caseMetadata',
              })
            }
          />
        </div>
        <div className="grid-col-3">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="trialHearingType"
            >
              Type
            </label>
            <input
              className="usa-input display-inline-block"
              id="trialHearingType"
              name="trialHearingType"
              type="text"
              value={caseMetadataFormState.trialHearing.trialHearingType}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'caseMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-3">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="trialHearingNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block"
              id="trialHearingNote"
              name="trialHearingNote"
              type="text"
              value={caseMetadataFormState.trialHearing.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'caseMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={caseMetadataFormState.trialHearing.transcriptOrdered}
                className="usa-checkbox__input"
                id="trialHearingTranscriptOrdered"
                name="trialHearingTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: e.target.name,
                    value: e.target.checked,
                    section: 'caseMetadata',
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="trialHearingTranscriptOrdered"
              >
                Transcript ordered
              </label>
            </div>
          </FormGroup>
        </div>
      </div>
    </fieldset>
  );
};
