import { AddressDisplay } from '../CaseDetail/AddressDisplay';
import { CardHeader } from './CardHeader';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import React from 'react';

export function CounselInformation({ userInfo }) {
  return (
    <div className="border-top-1px padding-top-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader
          showEditButton={false}
          title="Counsel’s Contact Information"
        />
        <div className="petition-review-petitioner-section">
          <div>
            <div>
              <address aria-labelledby="filing-contact-primary">
                <AddressDisplay
                  displayFirmNameOnNewLine
                  noMargin
                  showEmail
                  showEmailLabel
                  showPhoneLabel
                  contact={{
                    ...userInfo.contact,
                    email: userInfo.email,
                    firmName: userInfo.firmName,
                    name: `${userInfo.firstName} ${userInfo.lastName}`,
                  }}
                />
                <div className="margin-top-1">
                  <span className="semi-bold">Tax Court Bar No.: </span>
                  {userInfo.barNumber}
                </div>
              </address>
            </div>
          </div>
        </div>
        <InfoNotificationComponent
          alertInfo={{
            message:
              'Any additional counsel may enter an appearance after the Petition is processed by the Court.',
          }}
          dismissible={false}
          scrollToTop={false}
        />
      </div>
    </div>
  );
}
