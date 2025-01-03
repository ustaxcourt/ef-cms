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
      <div>
        <div>Docket no(s).</div>
        <div>{formattedMinuteSheet.docketNumbers}</div>
      </div>
      <div>
        <div>Petitioner(s)</div>
        <div>{formattedMinuteSheet.petitioners}</div>
      </div>
      <hr />
      <div>
        <div>
          <div>Judge</div>
          <div>{formattedMinuteSheet.judge}</div>

          <div>Trial clerk</div>
          <div>{formattedMinuteSheet.trialClerk}</div>
        </div>
        <div>
          <div>Court reporter</div>
          <div>{formattedMinuteSheet.courtReporter}</div>

          <div>Remote session</div>
          <div>{formattedMinuteSheet.remoteSession}</div>
        </div>
      </div>
      <hr />
      <div>
        <div>
          <div>Called</div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.called,
            }}
          />
        </div>
        <div>
          <div>Not called</div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.notCalled,
            }}
          />
        </div>
        <div>
          <div>Recalled</div>
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
          <div>Pretrial conference</div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.pretrialConference || '',
            }}
          />
        </div>
        <div>
          <div>Trial/Hearing</div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.trialHearing || '',
            }}
          />
        </div>
      </div>
      <hr />
      <div>
        <div>
          <div>Petitioner(s)</div>
          {formattedMinuteSheet.petitionerAppearances.map(
            (petitionerAppearance, idx) => (
              <div key={idx}>{petitionerAppearance}</div>
            ),
          )}
        </div>
        <div>
          <div>Respondent</div>
          {formattedMinuteSheet.respondentAppearances.map(
            (respondentAppearance, idx) => (
              <div key={idx}>{respondentAppearance}</div>
            ),
          )}
        </div>
      </div>
      <hr />
      <div>
        <div>
          <div>Jurisdiction Retained</div>
          {formattedMinuteSheet.jurisdictionRetained && (
            <div
              dangerouslySetInnerHTML={{
                __html: formattedMinuteSheet.jurisdictionRetained,
              }}
            />
          )}
        </div>
        <div>
          <div>Status Report ordered</div>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedMinuteSheet.statusReportOrdered,
            }}
          />
          <div>Stipulated Decision ordered</div>
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
            <div>{motion.motionType}</div>
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
      <div>
        <div>
          <div>Date Submitted</div>
          <div>{formattedMinuteSheet.trialBrief.dateSubmitted}</div>
          <div>Total Trial Hours</div>
          <div>{formattedMinuteSheet.trialBrief.totalTrialHours}</div>
        </div>
        <div>Bench opinion rendered</div>
        <div
          dangerouslySetInnerHTML={{
            __html: formattedMinuteSheet.trialBrief.benchOpinionRendered,
          }}
        />
        <div>
          <div>{formattedMinuteSheet.trialBrief.briefType}</div>
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
      <div>
        <div>
          <div>Petitioner Witnesses</div>
          {formattedMinuteSheet.petitionerWitnesses.map(witness => (
            <div key={witness.renderKey}>{witness.name}</div>
          ))}
        </div>
        <div>
          <div>Respondent Witnesses</div>
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
