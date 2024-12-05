import { Button } from '@web-client/ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MinuteSheetFormState,
  TRIAL_HEARING_OPTIONS,
} from '@web-client/presenter/state/minuteSheetFormState';
import React from 'react';

export const CaseMetadataFieldset = ({
  addRecalledRowHandler,
  caseMetadataFormState,
  onBlurHandler,
  onChangeHandler,
}: {
  addRecalledRowHandler: ({
    name,
    section,
  }: {
    name: string;
    section: string;
  }) => void;
  onChangeHandler: ({
    name,
    rowInfo,
    section,
    value,
  }: {
    name: string;
    rowInfo: { key: string; nestedName?: string };
    section: string;
    value: string | boolean;
  }) => void;
  onBlurHandler: () => void;
  caseMetadataFormState: MinuteSheetFormState['caseMetadata'];
}) => {
  return (
    <fieldset className="border-0 padding-0">
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col">
          <span className="usa-label margin-bottom-0">Called</span>
        </div>
        <div className="grid-col-auto">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="calledDate"
            label="Date"
            labelPosition="left"
            onChange={e =>
              onChangeHandler({
                name: 'called',
                rowInfo: {
                  key: 'date',
                },
                section: 'caseMetadata',
                value: e.target.value,
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
                  name: 'called',
                  rowInfo: {
                    key: 'note',
                  },
                  section: 'caseMetadata',
                  value: e.target.value,
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
                onChange={e =>
                  onChangeHandler({
                    name: 'called',
                    rowInfo: {
                      key: 'transcriptOrdered',
                    },
                    section: 'caseMetadata',
                    value: e.target.checked,
                  })
                }
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
        <div className="grid-col-fill">
          <span className="usa-label margin-bottom-0">Not Called</span>
        </div>
        <div className="grid-col-auto">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="notCalledDate"
            label="Date"
            labelPosition="left"
            onChange={e =>
              onChangeHandler({
                name: 'notCalled',
                rowInfo: {
                  key: 'date',
                },
                section: 'caseMetadata',
                value: e.target.value,
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
                  name: 'notCalled',
                  rowInfo: {
                    key: 'note',
                  },
                  section: 'caseMetadata',
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2"></div>
      </div>

      {Object.values(caseMetadataFormState.recalled).map((row, rowIndex) => {
        return (
          <div
            className="grid-row grid-gap align-items-center margin-bottom-1"
            key={row.renderKey}
          >
            <div className="grid-col-fill">
              {rowIndex === 0 && (
                <span className="usa-label margin-bottom-0">Re-called</span>
              )}
            </div>
            <div className="grid-col-auto">
              <DateSelector
                defaultValue={undefined}
                formGroupClassNames="margin-bottom-0"
                id={`reCalledDate-${row.renderKey}`}
                label="Date(s)"
                labelPosition="left"
                onChange={e =>
                  onChangeHandler({
                    name: 'recalled',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'date',
                    },
                    section: 'caseMetadata',
                    value: e.target.value,
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
                  value={caseMetadataFormState.recalled[rowIndex]?.note}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'recalled',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'note',
                      },
                      section: 'caseMetadata',
                      value: e.target.value,
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
                      caseMetadataFormState.recalled[rowIndex]
                        ?.transcriptOrdered
                    }
                    className="usa-checkbox__input"
                    id={`reCalledTranscriptOrdered${rowIndex}`}
                    name={`reCalledTranscriptOrdered${rowIndex}`}
                    type="checkbox"
                    onBlur={() => onBlurHandler()}
                    onChange={e => {
                      onChangeHandler({
                        name: 'recalled',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'transcriptOrdered',
                        },
                        section: 'caseMetadata',
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label margin-0"
                    htmlFor={`reCalledTranscriptOrdered${rowIndex}`}
                  >
                    Transcript ordered
                  </label>
                </div>
              </FormGroup>
            </div>
          </div>
        );
      })}
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <Button
          secondary={true}
          onClick={e => {
            e.preventDefault();
            addRecalledRowHandler({
              name: 'recalled',
              section: 'caseMetadata',
            });
          }}
        >
          Add Recall
        </Button>
      </div>
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-fill">
          <span className="usa-label margin-bottom-0">Pretrial conference</span>
        </div>
        <div className="grid-col-auto">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="pretrialConferenceDate"
            label="Date(s)"
            labelPosition="left"
            onChange={e =>
              onChangeHandler({
                name: 'pretrialConference',
                rowInfo: {
                  key: 'date',
                },
                section: 'caseMetadata',
                value: e.target.value,
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
                  name: 'pretrialConference',
                  rowInfo: {
                    key: 'note',
                  },
                  section: 'caseMetadata',
                  value: e.target.value,
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
                    name: 'pretrialConference',
                    rowInfo: {
                      key: 'transcriptOrdered',
                    },
                    section: 'caseMetadata',
                    value: e.target.checked,
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
        <div className="grid-col-fill">
          <span className="usa-label margin-bottom-0">Trial/Hearing</span>
        </div>
        <div className="grid-col-auto">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="trialHearingDate"
            label="Date(s)"
            labelPosition="left"
            onChange={e => {
              onChangeHandler({
                name: 'trialHearing',
                rowInfo: {
                  key: 'date',
                },
                section: 'caseMetadata',
                value: e.target.value,
              });
            }}
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
            <select
              className="usa-select display-inline-block"
              id="trialHearingType"
              name="trialHearingType"
              value={caseMetadataFormState.trialHearing.trialHearingType}
              onBlur={() => onBlurHandler()}
              onChange={e => {
                onChangeHandler({
                  name: 'trialHearing',
                  rowInfo: {
                    key: 'trialSessionType',
                  },
                  section: 'caseMetadata',
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {Object.keys(TRIAL_HEARING_OPTIONS).map(optionKey => {
                return (
                  <option key={optionKey} value={optionKey}>
                    {TRIAL_HEARING_OPTIONS[optionKey]}
                  </option>
                );
              })}
            </select>
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
              onChange={e => {
                onChangeHandler({
                  name: 'trialHearing',
                  rowInfo: {
                    key: 'note',
                  },
                  section: 'caseMetadata',
                  value: e.target.value,
                });
              }}
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
                    name: 'trialHearing',
                    rowInfo: {
                      key: 'transcriptOrdered',
                    },
                    section: 'caseMetadata',
                    value: e.target.checked,
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
