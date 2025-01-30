import { ChangeOfTrialLocationDocketHeader } from '@shared/business/utilities/pdfGenerator/components/ChangeOfTrialLocationDocketHeader';
import { OrderPrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/OrderPrimaryHeader';
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
  docketNumberWithSuffix,
  previousTrialSession,
  updatedTrialSession,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  previousTrialSession: TrialSessionLocationChangePDFInfo;
  updatedTrialSession: TrialSessionLocationChangePDFInfo;
}) => {
  return (
    <div>
      <OrderPrimaryHeader />
      <ChangeOfTrialLocationDocketHeader
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
                {updatedTrialSession.courthouseName && (
                  <div>{updatedTrialSession.courthouseName}</div>
                )}
                {updatedTrialSession.address1 && (
                  <div>{updatedTrialSession.address1}</div>
                )}
                {updatedTrialSession.address2 && (
                  <div>{updatedTrialSession.address2}</div>
                )}
                <div>
                  {updatedTrialSession.city}, {updatedTrialSession.state}{' '}
                  {updatedTrialSession.postalCode}
                </div>
                <div style={{ fontWeight: 'bold' }}>In Person</div>
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
              <td>{updatedTrialSession.judge?.name}</td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        &emsp;The parties are hereby notified that the Courtt&apos;s Notice of
        Trial for this case is amended in that the location of the Court&apos;s{' '}
        {previousTrialSession.trialLocation} Trial Session scheduled to begin on{' '}
        {formatDateString(updatedTrialSession.startDate, 'MMDDYYYY')}, will be
        held in {updatedTrialSession.trialLocation} at:
        <div style={{ paddingTop: '1rem', textAlign: 'center' }}>
          {updatedTrialSession.courthouseName && (
            <div>{updatedTrialSession.courthouseName}</div>
          )}
          {updatedTrialSession.address1 && (
            <div>{updatedTrialSession.address1}</div>
          )}
          {updatedTrialSession.address2 && (
            <div>{updatedTrialSession.address2}</div>
          )}
          <div>
            {updatedTrialSession.city}, {updatedTrialSession.state}{' '}
            {updatedTrialSession.postalCode}
          </div>
        </div>
        <div style={{ fontStyle: 'italic', paddingTop: '1rem' }}>
          The Standing Pretrial Order served in this case remains in full force
          and effect.
        </div>
      </div>
    </div>
  );
};
