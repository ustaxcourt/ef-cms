import { DocketHeader } from '@shared/business/utilities/pdfGenerator/components/DocketHeader';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
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
>;

export const NoticeOfChangeOfTrialLocation = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  trialSession,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
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
      <div>
        <div>
          <table style={{ width: '50%' }}>
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
        <div>
          <table style={{ width: '50%' }}>
            <thead>
              <th>Judge</th>
            </thead>
            <tr>
              <td>{trialSession.judge?.name}</td>
            </tr>
          </table>
        </div>
        The parties are hereby notified that the Court’s Notice of Trial for
        this case is amended in that the location of the Court&apos;s [PREVIOUS
        LOCATION] Trial Session scheduled to begin on [START DATE], will be held
        in [CURRENT LOCATION] at:
        <div>
          [COURTHOUSE NAME] [ADDRESS LINE 1] [ADDRESS LINE 2] [CITY], [ST] [ZIP
          CODE]
        </div>
        <div>
          The Standing Pretrial Order served in this case remains in full force
          and effect
        </div>
      </div>
    </div>
  );
};
