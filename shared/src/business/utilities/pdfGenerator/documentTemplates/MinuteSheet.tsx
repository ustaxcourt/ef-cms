import { FormattedMinuteSheet } from '@web-api/business/useCases/trialSessionMinutes/generateTrialSessionMinutesPdfInteractor';
import { MinuteSheetHeader } from '../components/MinuteSheetHeader';
import React from 'react';

export const MinuteSheet = ({
  formattedMinuteSheet,
}: {
  formattedMinuteSheet: FormattedMinuteSheet;
}) => {
  const insertSemicolon = (stringToCheckFor: string | undefined) =>
    stringToCheckFor ? ';' : '';
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

          <div>Remove session</div>
          <div>{formattedMinuteSheet.remoteSession}</div>
        </div>
      </div>
      <hr />
      <div>
        <div>
          <div>Called</div>
          <div>
            {`${formattedMinuteSheet.called?.date}${insertSemicolon(formattedMinuteSheet.called?.note)}`}
            <em>
              {' '}
              {`${formattedMinuteSheet.called?.note}${insertSemicolon(formattedMinuteSheet.called?.transcriptOrdered)}`}
            </em>{' '}
            {`${formattedMinuteSheet.called?.transcriptOrdered}`}
          </div>
        </div>
        <div>
          <div>Not called</div>
          <div>
            {`${formattedMinuteSheet.notCalled?.date}${insertSemicolon(formattedMinuteSheet.notCalled?.note)}`}
            <em>
              {' '}
              {`${formattedMinuteSheet.notCalled?.note}${insertSemicolon(formattedMinuteSheet.notCalled?.transcriptOrdered)}`}
            </em>{' '}
            {`${formattedMinuteSheet.notCalled?.transcriptOrdered}`}
          </div>
        </div>
        <div>
          <div>Recalled</div>
          <div>
            {formattedMinuteSheet.recalled.map(row => {
              const noteSemicolon = row.note ? ';' : '';
              const transcriptOrderedSemicolon = row.transcriptOrdered
                ? ';'
                : '';

              return (
                <div key={row.renderKey}>
                  {`${row.date}${noteSemicolon}`}
                  <em>{` ${row.note}${transcriptOrderedSemicolon}`}</em>
                  {` ${row.transcriptOrdered}`}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div>Pretrial conference</div>
          <div>
            {`${formattedMinuteSheet.pretrialConference?.date}${insertSemicolon(formattedMinuteSheet.pretrialConference?.note)}`}
            <em>
              {' '}
              {`${formattedMinuteSheet.pretrialConference?.note}${insertSemicolon(formattedMinuteSheet.pretrialConference?.transcriptOrdered)}`}
            </em>{' '}
            {`${formattedMinuteSheet.pretrialConference?.transcriptOrdered}`}
          </div>
        </div>
        <div>Trial/Hearing</div>
        <div>
          {`${formattedMinuteSheet.trialHearing?.date}${insertSemicolon(formattedMinuteSheet.trialHearing?.trialHearingType)}`}{' '}
          {`${formattedMinuteSheet.trialHearing?.trialHearingType}${insertSemicolon(formattedMinuteSheet.trialHearing?.note)}`}
          <em>
            {' '}
            {`${formattedMinuteSheet.trialHearing?.note}${insertSemicolon(formattedMinuteSheet.trialHearing?.transcriptOrdered)}`}
          </em>{' '}
          {`${formattedMinuteSheet.trialHearing?.transcriptOrdered}`}
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
          <div>
            {`${formattedMinuteSheet.jurisdictionRetained?.continued} - ${formattedMinuteSheet.jurisdictionRetained?.date}` +
              `${insertSemicolon(formattedMinuteSheet.jurisdictionRetained?.note)}`}
            <em>{` ${formattedMinuteSheet.jurisdictionRetained?.note}`}</em>
          </div>
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
