import { DocketHeader } from '@shared/business/utilities/pdfGenerator/components/DocketHeader';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { formatDateString } from '@shared/business/utilities/DateHandler';
import React from 'react';

export type TrialSessionLocationChangePDFInfo = Pick<
  RawTrialSession,
  | 'trialSessionId'
  | 'judge'
  | 'address1'
  | 'address2'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'courthouseName'
  | 'startDate'
  | 'trialLocation'
>;

export const NoticeOfChangeOfTrialLocation = ({
  caseCaptionExtension,
  caseTitle,
  currentTrialSession,
  docketNumberWithSuffix,
  trialSession,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  currentTrialSession: TrialSessionLocationChangePDFInfo;
  trialSession: TrialSessionLocationChangePDFInfo;
}) => {
  return (
    <div>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="NOTICE OF CHANGE OF TRIAL LOCATION"
      />
      <div style={{ display: 'flex', paddingBottom: '2rem' }}>
        <div style={{ marginRight: '1rem', width: '50%' }}>
          <table>
            <thead>
              <th>Trial At</th>
            </thead>
            <tr>
              <td>
                {['courthouseName', 'address1', 'address2', ['city', 'state']]
                  .filter(prop => {
                    if (Array.isArray(prop))
                      return prop.some(key => !!trialSession[key]);
                    return !!trialSession[prop];
                  })
                  .map(prop => {
                    if (Array.isArray(prop))
                      return (
                        <div key={prop[0]}>
                          {prop
                            .filter(key => !!trialSession[key])
                            .map(key => trialSession[key])
                            .join(', ')}
                        </div>
                      );

                    return <div key={prop}>{trialSession[prop]}</div>;
                  })}
                <div>In Person</div>
              </td>
            </tr>
          </table>
        </div>
        <div style={{ width: '50%' }}>
          <table style={{ height: '100%' }}>
            <thead>
              <th>Judge</th>
            </thead>
            <tr>
              <td>{trialSession.judge?.name}</td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        &emsp;The parties are hereby notified that the Court’s Notice of Trial
        for this case is amended in that the location of the Court&apos;s{' '}
        {currentTrialSession.trialLocation} Trial Session scheduled to begin on{' '}
        {formatDateString(trialSession.startDate, 'MMDDYYYY')}, will be held in{' '}
        {trialSession.trialLocation} at:
        <div style={{ paddingTop: '1rem', textAlign: 'center' }}>
          {trialSession.courthouseName && (
            <div>{trialSession.courthouseName}</div>
          )}
          {trialSession.address1 && <div>{trialSession.address1}</div>}
          {trialSession.address2 && <div>{trialSession.address2}</div>}
          <div>
            {trialSession.city}, {trialSession.state} {trialSession.postalCode}
          </div>
        </div>
        <div style={{ fontStyle: 'italic', paddingTop: '1rem' }}>
          The Standing Pretrial Order served in this case remains in full force
          and effect
        </div>
      </div>
    </div>
  );
};
