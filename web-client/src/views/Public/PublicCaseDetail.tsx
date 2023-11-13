import { Mobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { PublicCaseDetailHeader } from './PublicCaseDetailHeader';
import { PublicCaseDetailSubnavTabs } from './PublicCaseDetailSubnavTabs';
import { PublicDocketRecord } from './PublicDocketRecord';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

const props = {
  publicCaseDetailHelper: state.publicCaseDetailHelper,
};

export const PublicCaseDetail = connect(
  props,
  function ({ publicCaseDetailHelper }: typeof props) {
    return (
      <>
        <PublicCaseDetailHeader />
        <Mobile>
          <section className="usa-section grid-container margin-top-2 padding-bottom-3"></section>
        </Mobile>
        {!publicCaseDetailHelper.isCaseSealed && (
          <>
            <PublicCaseDetailSubnavTabs />
            <section className="usa-section grid-container">
              <PublicDocketRecord />
            </section>
          </>
        )}

        {publicCaseDetailHelper.isCaseSealed && (
          <>
            <div className="grid-container">
              <p className="margin-top-5 margin-bottom-5">
                This case is sealed and not accessible to the public.
              </p>
            </div>
          </>
        )}
      </>
    );
  },
);

PublicCaseDetail.displayName = 'PublicCaseDetail';
