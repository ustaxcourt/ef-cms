import { CaseDetailEdit } from '../CaseDetailEdit/CaseDetailEdit';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { PetitionQcDocumentPreview } from './PetitionQcDocumentPreview';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const PetitionQc = connect(function PetitionQc() {
  return (
    <>
      <CaseDetailHeader />
      <section className="usa-section grid-container DocumentDetail">
        <h2 className="heading-1">Petition</h2>
        <SuccessNotification />
        <ErrorNotification />
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <CaseDetailEdit />
            </div>
            <div className="grid-col-7">
              <PetitionQcDocumentPreview title="Add Document(s)" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

PetitionQc.displayName = 'PetitionQc';
