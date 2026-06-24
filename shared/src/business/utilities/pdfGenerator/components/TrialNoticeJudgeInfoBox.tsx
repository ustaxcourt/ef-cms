import React from 'react';

export const TrialNoticeJudgeInfoBox = ({
  chambersPhoneNumber,
  judgeLastName,
}: {
  judgeLastName: string;
  chambersPhoneNumber?: string;
}) => {
  return (
    <div className="info-box info-box-judge" id="judge-info">
      <div className="info-box-header">Judge</div>
      <div className="info-box-content">
        <div>{judgeLastName}</div>
        <div>400 Second St., NW</div>
        <div>Washington, DC 20217</div>
        <div>Chambers Phone: {chambersPhoneNumber}</div>
      </div>
    </div>
  );
};
