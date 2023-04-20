import 'regenerator-runtime';
require('@babel/register')({
  extensions: ['.tsx'],
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

// Documents
import { AddressLabelCoverSheet } from '../pdfGenerator/documentTemplates/AddressLabelCoverSheet.tsx';

import { CaseInventoryReport } from '../pdfGenerator/documentTemplates/CaseInventoryReport.tsx';
import { ChangeOfAddress } from '../pdfGenerator/documentTemplates/ChangeOfAddress.tsx';
import { CoverSheet } from '../pdfGenerator/documentTemplates/CoverSheet.tsx';
import { DatePrintedFooter } from '../pdfGenerator/components/DatePrintedFooter.tsx';
import { DateServedFooter } from '../pdfGenerator/components/DateServedFooter.tsx';
import { DocketRecord } from '../pdfGenerator/documentTemplates/DocketRecord.tsx';
import { GettingReadyForTrialChecklist } from '../pdfGenerator/documentTemplates/GettingReadyForTrialChecklist.tsx';
import { NoticeOfChangeOfTrialJudge } from '../pdfGenerator/documentTemplates/NoticeOfChangeOfTrialJudge.tsx';
import { NoticeOfChangeToInPersonProceeding } from '../pdfGenerator/documentTemplates/NoticeOfChangeToInPersonProceeding';
import { NoticeOfChangeToRemoteProceeding } from '../pdfGenerator/documentTemplates/NoticeOfChangeToRemoteProceeding.tsx';
import { NoticeOfDocketChange } from '../pdfGenerator/documentTemplates/NoticeOfDocketChange.tsx';
import { NoticeOfReceiptOfPetition } from '../pdfGenerator/documentTemplates/NoticeOfReceiptOfPetition.tsx';
import { NoticeOfTrialIssued } from '../pdfGenerator/documentTemplates/NoticeOfTrialIssued.tsx';
import { NoticeOfTrialIssuedInPerson } from '../pdfGenerator/documentTemplates/NoticeOfTrialIssuedInPerson.tsx';
import { Order } from '../pdfGenerator/documentTemplates/Order.tsx';
import { PageMetaHeaderDocket } from '../pdfGenerator/components/PageMetaHeaderDocket.tsx';
import { PendingReport } from '../pdfGenerator/documentTemplates/PendingReport.tsx';
import { PractitionerCaseList } from '../pdfGenerator/documentTemplates/PractitionerCaseList.tsx';
import { PretrialMemorandum } from '../pdfGenerator/components/PretrialMemorandum.tsx';
import { PrintableTrialSessionWorkingCopyMetaHeader } from '../pdfGenerator/components/PrintableTrialSessionWorkingCopyMetaHeader.tsx';
import { PrintableWorkingCopySessionList } from '../pdfGenerator/documentTemplates/PrintableWorkingCopySessionList.tsx';
import { ReceiptOfFiling } from '../pdfGenerator/documentTemplates/ReceiptOfFiling.tsx';
import { ReportsMetaHeader } from '../pdfGenerator/components/ReportsMetaHeader.tsx';
import { StandingPretrialOrder } from '../pdfGenerator/documentTemplates/StandingPretrialOrder.tsx';
import { StandingPretrialOrderForSmallCase } from '../pdfGenerator/documentTemplates/StandingPretrialOrderForSmallCase.tsx';
import { TrialCalendar } from '../pdfGenerator/documentTemplates/TrialCalendar.tsx';
import { TrialSessionPlanningReport } from '../pdfGenerator/documentTemplates/TrialSessionPlanningReport.tsx';

// Emails
import { BouncedEmailAlert } from '../emailGenerator/emailTemplates/BouncedEmailAlert.tsx';

import { DocumentService } from '../emailGenerator/emailTemplates/DocumentService.tsx';
import { PetitionService } from '../emailGenerator/emailTemplates/PetitionService.tsx';
import React from 'react';
import ReactDOM from 'react-dom/server';

const components = {
  AddressLabelCoverSheet,
  BouncedEmailAlert,
  CaseInventoryReport,
  ChangeOfAddress,
  CoverSheet,
  DatePrintedFooter,
  DateServedFooter,
  DocketRecord,
  DocumentService,
  GettingReadyForTrialChecklist,
  NoticeOfChangeOfTrialJudge,
  NoticeOfChangeToInPersonProceeding,
  NoticeOfChangeToRemoteProceeding,
  NoticeOfDocketChange,
  NoticeOfReceiptOfPetition,
  NoticeOfTrialIssued,
  NoticeOfTrialIssuedInPerson,
  Order,
  PageMetaHeaderDocket,
  PendingReport,
  PetitionService,
  PractitionerCaseList,
  PretrialMemorandum,
  PrintableTrialSessionWorkingCopyMetaHeader,
  PrintableWorkingCopySessionList,
  ReceiptOfFiling,
  ReportsMetaHeader,
  StandingPretrialOrder,
  StandingPretrialOrderForSmallCase,
  TrialCalendar,
  TrialSessionPlanningReport,
};

export const reactTemplateGenerator = ({ componentName, data = {} }) => {
  const componentTemplate = ReactDOM.renderToString(
    React.createElement(components[componentName], data),
  );

  return componentTemplate;
};
