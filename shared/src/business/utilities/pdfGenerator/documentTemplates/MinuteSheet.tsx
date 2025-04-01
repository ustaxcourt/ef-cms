import { FormattedMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet';
import { MinuteSheetHeader } from '../components/MinuteSheetHeader';
import React from 'react';

/* eslint-disable complexity */
export const MinuteSheet = ({
  formattedMinuteSheet,
}: {
  formattedMinuteSheet: FormattedMinuteSheet;
}) => {
  return (
    <div className="minute-sheet-pdf">
      <MinuteSheetHeader
        trialSessionLocation={formattedMinuteSheet.trialLocation}
        trialStartDate={formattedMinuteSheet.trialStartDate}
      />
      <h2>Minutes of Proceedings</h2>
      <div className="two-column-minute-sheet-section">
        <div className="minute-sheet-field">
          <div>
            <strong>Docket no(s).</strong>
          </div>
          <div>{formattedMinuteSheet.formattedDocketNumbers}</div>
        </div>
        <div className="minute-sheet-field">
          <div>
            <strong>Case caption</strong>
          </div>
          <div>{formattedMinuteSheet.caseTitle}</div>
        </div>
      </div>
      <hr />
      <div className="two-column-minute-sheet-section">
        <div>
          {formattedMinuteSheet.judgeFullName && (
            <div className="minute-sheet-field">
              <div>
                <strong>{formattedMinuteSheet.judgeTitle}</strong>
              </div>
              <div>{formattedMinuteSheet.judgeFullName}</div>
            </div>
          )}

          {formattedMinuteSheet.trialClerk && (
            <div className="minute-sheet-field">
              <div>
                <strong>Trial clerk</strong>
              </div>
              <div>{formattedMinuteSheet.trialClerk}</div>
            </div>
          )}
        </div>
        <div>
          {formattedMinuteSheet.courtReporter && (
            <div className="minute-sheet-field">
              <div>
                <strong>Court reporter</strong>
              </div>
              <div>{formattedMinuteSheet.courtReporter}</div>
            </div>
          )}

          <div className="minute-sheet-field">
            <div>
              <strong>Remote session</strong>
            </div>
            <div>{formattedMinuteSheet.remoteSession}</div>
          </div>
        </div>
      </div>
      {(formattedMinuteSheet.called ||
        formattedMinuteSheet.notCalled ||
        formattedMinuteSheet.recalled.length > 0 ||
        formattedMinuteSheet.pretrialConference ||
        formattedMinuteSheet.trialHearing) && <hr />}
      <div>
        {formattedMinuteSheet.called && (
          <div className="minute-sheet-field">
            <div>
              <strong>Calendar Called</strong>
            </div>
            {/*
              Since we're relying on formatting helpers to describe the content that should displayed in this PDF, including
              certain markup (e.g., <em> tags), we need to use `dangerouslySetInnerHTML` to render the content as HTML; otherwise the markup
              itself is rendered as text.

              Since this is only being used to render PDF content as HTML before converting to PDF and does not rely on re-rendering as
              content changes, this is safe to do. Additionally, we are sanitizing any user input prior to feeding into the doc generator.
            */}
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.called,
              }}
            />
          </div>
        )}
        {formattedMinuteSheet.notCalled && (
          <div className="minute-sheet-field">
            <div>
              <strong>Not called</strong>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.notCalled,
              }}
            />
          </div>
        )}

        {formattedMinuteSheet.recalled.length > 0 && (
          <div className="minute-sheet-field">
            <div>
              <strong>Recalled</strong>
            </div>
            <div>
              {formattedMinuteSheet.recalled.map((row, index) => (
                <div
                  dangerouslySetInnerHTML={{ __html: row.content }}
                  key={index}
                />
              ))}
            </div>
          </div>
        )}
        {formattedMinuteSheet.pretrialConference && (
          <div className="minute-sheet-field">
            <div>
              <strong>Pretrial conference</strong>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.pretrialConference,
              }}
            />
          </div>
        )}
        {formattedMinuteSheet.trialHearing && (
          <div className="minute-sheet-field">
            <div>
              <strong>Trial/Hearing</strong>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.trialHearing,
              }}
            />
          </div>
        )}
      </div>
      <hr />
      <div className="two-column-minute-sheet-section">
        {formattedMinuteSheet.petitionerAppearances.length > 0 && (
          <div className="minute-sheet-field">
            <div>
              <strong>Petitioner(s)</strong>
            </div>
            {formattedMinuteSheet.petitionerAppearances.map(
              (petitionerAppearance, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: petitionerAppearance }}
                ></div>
              ),
            )}
          </div>
        )}
        {formattedMinuteSheet.respondentAppearances.length > 0 && (
          <div className="minute-sheet-field">
            <div>
              <strong>Respondent</strong>
            </div>
            {formattedMinuteSheet.respondentAppearances.map(
              (respondentAppearance, index) => (
                <div key={index}>{respondentAppearance}</div>
              ),
            )}
          </div>
        )}
      </div>
      {(formattedMinuteSheet.jurisdictionContinued ||
        formattedMinuteSheet.jurisdictionRetained ||
        formattedMinuteSheet.statusReportOrdered ||
        formattedMinuteSheet.stipulatedDecisionOrdered) && <hr />}
      <div>
        {formattedMinuteSheet.jurisdictionRetained && (
          <div className="minute-sheet-field">
            <div>
              <strong>Jurisdiction Retained</strong>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.jurisdictionRetained,
              }}
            />
          </div>
        )}
        {formattedMinuteSheet.jurisdictionContinued && (
          <div className="minute-sheet-field">
            <div>
              <strong>Continued</strong>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.jurisdictionContinued,
              }}
            />
          </div>
        )}
        {formattedMinuteSheet.statusReportOrdered && (
          <div className="minute-sheet-field">
            <div>
              <strong>Status Report ordered</strong>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.statusReportOrdered,
              }}
            />
          </div>
        )}
        {formattedMinuteSheet.stipulatedDecisionOrdered && (
          <div className="minute-sheet-field">
            <div>
              <strong>Stipulated Decision ordered</strong>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.stipulatedDecisionOrdered,
              }}
            />
          </div>
        )}
      </div>

      {formattedMinuteSheet.motions?.length > 0 && (
        <>
          <hr />
          <div className="minute-sheet-field">
            {formattedMinuteSheet.motions.map((motion, index) => (
              <div key={index}>
                <div>
                  <strong>{motion.motionType}</strong>
                </div>
                <div dangerouslySetInnerHTML={{ __html: motion.content }} />
              </div>
            ))}
          </div>
        </>
      )}

      {formattedMinuteSheet.actionsAndFilings?.length > 0 && (
        <>
          <hr />
          <div className="minute-sheet-field">
            <div>
              <strong>Other actions and filings</strong>
            </div>
            {formattedMinuteSheet.actionsAndFilings.map((action, index) => (
              <div
                dangerouslySetInnerHTML={{ __html: action.content }}
                key={index}
              />
            ))}
          </div>
        </>
      )}

      {(formattedMinuteSheet.trialBrief.dateSubmitted ||
        formattedMinuteSheet.trialBrief.totalTrialHours ||
        formattedMinuteSheet.trialBrief.benchOpinionRendered ||
        formattedMinuteSheet.trialBrief.briefDetails.length > 0) && (
        <>
          <hr />
          <div className="two-column-minute-sheet-section">
            {formattedMinuteSheet.trialBrief.dateSubmitted && (
              <div className="minute-sheet-field">
                <div>
                  <strong>Date Submitted</strong>
                </div>
                <div>{formattedMinuteSheet.trialBrief.dateSubmitted}</div>
              </div>
            )}
            {formattedMinuteSheet.trialBrief.totalTrialHours && (
              <div className="minute-sheet-field">
                <div>
                  <strong>Total Trial Hours</strong>
                </div>
                <div>{formattedMinuteSheet.trialBrief.totalTrialHours}</div>
              </div>
            )}
          </div>
          <div>
            {formattedMinuteSheet.trialBrief.benchOpinionRendered && (
              <div className="minute-sheet-field">
                <div>
                  <strong>Bench opinion rendered</strong>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      formattedMinuteSheet.trialBrief.benchOpinionRendered,
                  }}
                />
              </div>
            )}
            {formattedMinuteSheet.trialBrief.note && (
              <div
                className="minute-sheet-field"
                dangerouslySetInnerHTML={{
                  __html: formattedMinuteSheet.trialBrief.note,
                }}
              />
            )}
          </div>
          {formattedMinuteSheet.trialBrief.briefDetails.length > 0 && (
            <div className="minute-sheet-field">
              <div>
                <strong>{formattedMinuteSheet.trialBrief.briefType}</strong>
              </div>
              {formattedMinuteSheet.trialBrief.briefDetails.map(
                (briefDetail, index) => (
                  <div
                    dangerouslySetInnerHTML={{ __html: briefDetail }}
                    key={index}
                  />
                ),
              )}
            </div>
          )}
        </>
      )}

      {((formattedMinuteSheet.petitionerWitnesses &&
        formattedMinuteSheet.petitionerWitnesses.length > 0) ||
        (formattedMinuteSheet.respondentWitnesses &&
          formattedMinuteSheet.respondentWitnesses.length > 0)) && (
        <>
          <hr />
          <div className="two-column-minute-sheet-section">
            {formattedMinuteSheet.petitionerWitnesses?.length > 0 && (
              <div className="minute-sheet-field">
                <div>
                  <strong>Petitioner Witnesses</strong>
                </div>
                {formattedMinuteSheet.petitionerWitnesses.map(
                  (witness, index) => (
                    <div key={index}>{witness.name}</div>
                  ),
                )}
              </div>
            )}
            {formattedMinuteSheet.respondentWitnesses?.length > 0 && (
              <div className="minute-sheet-field">
                <div>
                  <strong>Respondent Witnesses</strong>
                </div>
                {formattedMinuteSheet.respondentWitnesses.map(
                  (witness, index) => (
                    <div key={index}>{witness.name}</div>
                  ),
                )}
              </div>
            )}
          </div>
        </>
      )}

      {formattedMinuteSheet.exhibits?.length > 0 && (
        <>
          <div>
            <table className="exhibits-table">
              <thead>
                <tr>
                  <th>Exhibit</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {formattedMinuteSheet.exhibits.map((exhibit, index) => (
                  <tr key={index}>
                    <td>{exhibit.description}</td>
                    <td>{exhibit.status}</td>
                    <td>{exhibit.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
