import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { EditDocketEntryMetaDocketEntryPreview } from './EditDocketEntryMetaDocketEntryPreview';
import { EditDocketEntryMetaFormCourtIssued } from './EditDocketEntryMetaFormCourtIssued';
import { EditDocketEntryMetaFormDocument } from './EditDocketEntryMetaFormDocument';
import { EditDocketEntryMetaFormNoDocument } from './EditDocketEntryMetaFormNoDocument';
import { EditDocketEntryMetaTabAction } from './EditDocketEntryMetaTabAction';
import { EditDocketEntryMetaTabService } from './EditDocketEntryMetaTabService';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ApplyStampForm = connect({}, function ApplyStampForm({}) {
  return (
    <>
      <CaseDetailHeader />

      <section className="usa-section grid-container">
        <ErrorNotification />
        APPLY YOUR STAMP LADY
      </section>
    </>
  );
});
