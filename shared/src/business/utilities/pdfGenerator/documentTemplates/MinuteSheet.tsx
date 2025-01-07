import { FormattedMinuteSheet } from '@web-api/business/useCases/trialSessionMinutes/generateTrialSessionMinutesPdfInteractor';
import { MinuteSheetHeader } from '../components/MinuteSheetHeader';
import React from 'react';

export const MinuteSheet = ({
  formattedMinuteSheet,
}: {
  formattedMinuteSheet: FormattedMinuteSheet;
}) => {
  return (
    <>
      <MinuteSheetHeader
        trialSessionLocation={formattedMinuteSheet.trialLocation}
        trialStartDate={formattedMinuteSheet.trialStartDate}
      />
      <h1>Minutes of Proceedings</h1>
      <div className="minute-sheet-pdf">
        <div>
          <div>
            <strong>Docket no(s).</strong>
          </div>
          <div>{formattedMinuteSheet.docketNumbers}</div>
        </div>
        <div>
          <div>
            <strong>Petitioner(s)</strong>
          </div>
          <div>{formattedMinuteSheet.petitioners}</div>
        </div>
      </div>
      <hr />
      <div className="minute-sheet-pdf">
        <div>
          <div>
            <strong>Judge</strong>
          </div>
          <div>{formattedMinuteSheet.judge}</div>

          <div>
            <strong>Trial clerk</strong>
          </div>
          <div>{formattedMinuteSheet.trialClerk}</div>
        </div>
        <div>
          <div>
            <strong>Court reporter</strong>
          </div>
          <div>{formattedMinuteSheet.courtReporter}</div>

          <div>
            <strong>Remote session</strong>
          </div>
          <div>{formattedMinuteSheet.remoteSession}</div>
        </div>
      </div>
      <hr />
      <div className="minute-sheet-pdf">
        <div>
          <div>
            <strong>Called</strong>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.called,
            }}
          />
        </div>
        <div>
          <div>
            <strong>Not called</strong>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.notCalled,
            }}
          />
        </div>
      </div>
      <div>
        <div>
          <strong>Recalled</strong>
        </div>
        <div>
          {formattedMinuteSheet.recalled.map(row => (
            <div
              dangerouslySetInnerHTML={{ __html: row.content }}
              key={row.renderKey}
            />
          ))}
        </div>
      </div>
      <div>
        <div>
          <strong>Pretrial conference</strong>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: formattedMinuteSheet.pretrialConference || '',
          }}
        />
      </div>
      <div>
        <div>
          <strong>Trial/Hearing</strong>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: formattedMinuteSheet.trialHearing || '',
          }}
        />
      </div>
      <hr />
      <div className="minute-sheet-pdf">
        <div>
          <div>
            <strong>Petitioner(s)</strong>
          </div>
          {formattedMinuteSheet.petitionerAppearances.map(
            (petitionerAppearance, idx) => (
              <div key={idx}>{petitionerAppearance}</div>
            ),
          )}
        </div>
        <div>
          <div>
            <strong>Respondent</strong>
          </div>
          {formattedMinuteSheet.respondentAppearances.map(
            (respondentAppearance, idx) => (
              <div key={idx}>{respondentAppearance}</div>
            ),
          )}
        </div>
      </div>
      <hr />
      <div className="minute-sheet-pdf">
        <div>
          <div>
            <strong>Jurisdiction Retained</strong>
          </div>
          {formattedMinuteSheet.jurisdictionRetained && (
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.jurisdictionRetained,
              }}
            />
          )}
        </div>
        <div>
          <div>
            <strong>Status Report ordered</strong>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.statusReportOrdered,
            }}
          />
          <div>
            <strong>Stipulated Decision ordered</strong>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.stipulatedDecisionOrdered,
            }}
          />
        </div>
      </div>
      <hr />
      <div>
        {formattedMinuteSheet.motions.map(motion => (
          <div key={motion.renderKey}>
            <div>
              <strong>{motion.motionType}</strong>
            </div>
            <div dangerouslySetInnerHTML={{ __html: motion.content }} />
          </div>
        ))}
      </div>
      <hr />
      <div>
        {formattedMinuteSheet.actionsAndFilings.map(action => (
          <div
            dangerouslySetInnerHTML={{ __html: action.content }}
            key={action.renderKey}
          />
        ))}
      </div>
      <hr />
      <div className="minute-sheet-pdf">
        <div>
          <div>
            <strong>Date Submitted</strong>
          </div>
          <div>{formattedMinuteSheet.trialBrief.dateSubmitted}</div>
          <div>
            <strong>Total Trial Hours</strong>
          </div>
          <div>{formattedMinuteSheet.trialBrief.totalTrialHours}</div>
        </div>
        <div>
          <div>
            <strong>Bench opinion rendered</strong>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.trialBrief.benchOpinionRendered,
            }}
          />
        </div>
      </div>
      <div className="minute-sheet-pdf">
        <div>
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
      </div>
      <hr />
      <div className="minute-sheet-pdf">
        <div>
          <div>
            <strong>Petitioner Witnesses</strong>
          </div>
          {formattedMinuteSheet.petitionerWitnesses.map(witness => (
            <div key={witness.renderKey}>{witness.name}</div>
          ))}
        </div>
        <div>
          <div>
            <strong>Respondent Witnesses</strong>
          </div>
          {formattedMinuteSheet.respondentWitnesses.map(witness => (
            <div key={witness.renderKey}>{witness.name}</div>
          ))}
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Exhibit</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {formattedMinuteSheet.exhibits.map(exhibit => (
              <tr key={exhibit.renderKey}>
                <td>{exhibit.description}</td>
                <td>{exhibit.status}</td>
                <td>{exhibit.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
