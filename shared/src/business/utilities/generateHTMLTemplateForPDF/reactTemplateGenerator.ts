import 'regenerator-runtime';
import babelRegister from '@babel/register';

// Documents
import { AddressLabelCoverSheet } from '../pdfGenerator/documentTemplates/AddressLabelCoverSheet';
import { CaseInventoryReport } from '../pdfGenerator/documentTemplates/CaseInventoryReport';
import { ChangeOfAddress } from '../pdfGenerator/documentTemplates/ChangeOfAddress';
import { CoverSheet } from '../pdfGenerator/documentTemplates/CoverSheet';
import { DatePrintedFooter } from '../pdfGenerator/components/DatePrintedFooter';
import { DateServedFooter } from '../pdfGenerator/components/DateServedFooter';
import { DocketRecord } from '../pdfGenerator/documentTemplates/DocketRecord';
import { GettingReadyForTrialChecklist } from '../pdfGenerator/documentTemplates/GettingReadyForTrialChecklist';
import { NoticeOfChangeOfTrialJudge } from '../pdfGenerator/documentTemplates/NoticeOfChangeOfTrialJudge';
import { NoticeOfChangeToInPersonProceeding } from '../pdfGenerator/documentTemplates/NoticeOfChangeToInPersonProceeding';
import { NoticeOfChangeToRemoteProceeding } from '../pdfGenerator/documentTemplates/NoticeOfChangeToRemoteProceeding';
import { NoticeOfDocketChange } from '../pdfGenerator/documentTemplates/NoticeOfDocketChange';
import { NoticeOfReceiptOfPetition } from '../pdfGenerator/documentTemplates/NoticeOfReceiptOfPetition';
import { NoticeOfTrialIssued } from '../pdfGenerator/documentTemplates/NoticeOfTrialIssued';
import { NoticeOfTrialIssuedInPerson } from '../pdfGenerator/documentTemplates/NoticeOfTrialIssuedInPerson';
import { Order } from '../pdfGenerator/documentTemplates/Order';
import { PageMetaHeaderDocket } from '../pdfGenerator/components/PageMetaHeaderDocket';
import { PendingReport } from '../pdfGenerator/documentTemplates/PendingReport';
import { PractitionerCaseList } from '../pdfGenerator/documentTemplates/PractitionerCaseList';
import { PretrialMemorandum } from '../pdfGenerator/components/PretrialMemorandum';
import { PrintableTrialSessionWorkingCopyMetaHeader } from '../pdfGenerator/components/PrintableTrialSessionWorkingCopyMetaHeader';
import { PrintableWorkingCopySessionList } from '../pdfGenerator/documentTemplates/PrintableWorkingCopySessionList';
import { ReceiptOfFiling } from '../pdfGenerator/documentTemplates/ReceiptOfFiling';
import { ReportsMetaHeader } from '../pdfGenerator/components/ReportsMetaHeader';
import { StandingPretrialOrder } from '../pdfGenerator/documentTemplates/StandingPretrialOrder';
import { StandingPretrialOrderForSmallCase } from '../pdfGenerator/documentTemplates/StandingPretrialOrderForSmallCase';
import { TrialCalendar } from '../pdfGenerator/documentTemplates/TrialCalendar';
import { TrialSessionPlanningReport } from '../pdfGenerator/documentTemplates/TrialSessionPlanningReport';

// Emails
import { BouncedEmailAlert } from '../emailGenerator/emailTemplates/BouncedEmailAlert';
import { DocumentService } from '../emailGenerator/emailTemplates/DocumentService';
import { PetitionService } from '../emailGenerator/emailTemplates/PetitionService';
import React from 'react';
import ReactDOM from 'react-dom/server';

babelRegister({
  extensions: [''],
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

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
} as const;

export const reactTemplateGenerator = ({
  componentName,
  data = {},
}: {
  componentName: keyof typeof components;
  data: any;
}) => {
  const reactComponent: any = components[componentName];
  const componentTemplate = ReactDOM.renderToString(
    React.createElement(reactComponent, data),
  );

  return componentTemplate;
};
