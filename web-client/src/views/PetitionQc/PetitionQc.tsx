import { CaseDetailEdit } from '../CaseDetailEdit/CaseDetailEdit';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { PetitionQcDocumentPreview } from './PetitionQcDocumentPreview';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const PetitionQc = connect({}, function PetitionQc() {
  return (
    <>
      <CaseDetailHeader />
      <section className="DocumentDetail tw:py-12 tw:max-w-[1440px] tw:mx-auto tw:px-4">
        <h2
          className="tw:mt-0 tw:mb-4 tw:text-3xl tw:font-bold"
          data-testid="petition-qc-page-heading"
        >
          Petition
        </h2>
        <SuccessNotification />
        <ErrorNotification />
        <div className="tw:max-w-[1440px] tw:mx-auto tw:px-0">
          <div className="tw:flex tw:flex-row tw:gap-4">
            <div className="tw:flex-5 tw:min-w-0">
              <CaseDetailEdit />
            </div>
            <div className="tw:flex-7 tw:min-w-0">
              <PetitionQcDocumentPreview title="Add Document(s)" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

PetitionQc.displayName = 'PetitionQc';
