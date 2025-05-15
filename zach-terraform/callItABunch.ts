import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { generateHTMLTemplateForPDF } from '@shared/business/utilities/generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { NoticeOfChangeOfTrialJudge } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeOfTrialJudge';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import {
  applicationContext,
  ServerApplicationContext,
} from '@web-api/applicationContext';
import { FormattedTrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { chunk } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom/server';

let totalDocsCreated = 0;
async function main() {
  // while (true) {
  //   await fireALambda();
  //   totalDocsCreated++;
  //   console.log('totalDocsCreated: ', totalDocsCreated);
  //   await sleep(1000);
  // }
  const pdfStuff = await noticeOfChangeOfTrialJudge({
    applicationContext,
    data: {
      caseTitle: 'YO bo bee doo',
      caseCaptionExtension: 'super long',
      docketNumberWithSuffix: '101010101-20S',
      nameOfClerk: 'zach',
      titleOfClerk: 'lordd',
      trialInfo: {
        ...MOCK_TRIAL_REGULAR,
        formattedStartDate: '2021-11-24T14:54:33.152Z',
        formattedStartTime: '2021-11-24T14:54:33.152Z',
        formattedJudge: 'formattedJudge',
      },
    },
  });

  const totalDocuments = 400;
  const batchSize = 20;
  const randomArray = new Array(totalDocuments).fill(1);
  const batches = chunk(randomArray, batchSize);
  for (const batch of batches) {
    await Promise.all(batch.map(() => fireALambda(pdfStuff)));
  }
}

export const noticeOfChangeOfTrialJudge = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    nameOfClerk: string;
    titleOfClerk: string;
    trialInfo: FormattedTrialInfoType;
  };
}): Promise<{
  contentHtml: any;
  displayHeaderFooter: any;
  docketNumber: any;
  footerHtml: any;
}> => {
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeOfTrialJudgeTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfChangeOfTrialJudge, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeOfTrialJudgeTemplate,
  });

  const footerHtml = ReactDOM.renderToString(
    React.createElement(DateServedFooter, {
      dateServed: applicationContext.getUtilities().formatNow('MMDDYY'),
    }),
  );

  return {
    contentHtml: pdfContentHtml,
    displayHeaderFooter: true,
    docketNumber: docketNumberWithSuffix,
    footerHtml,
  };
};

async function fireALambda(pdfStuff: {
  contentHtml: any;
  displayHeaderFooter: any;
  docketNumber: any;
  footerHtml: any;
}) {
  const client = new LambdaClient({
    region: 'us-east-1',
  });
  // const contentHtml = '<h1>Content</h1>';
  // const displayHeaderFooter = true;
  // const docketNumber = '1010101-22';
  // const headerHtml = '<h1>Header</h1>';
  // const footerHtml = '<h1>Footer</h1>';
  // const overwriteFooter = false;
  const command = new InvokeCommand({
    FunctionName: `open_close_a_lot_exp4_green`,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify(pdfStuff)),
  });

  const response = await client.send(command);
  if (response.FunctionError) {
    console.error(response.FunctionError);
    throw response.FunctionError;
  }
  const textDecoder = new TextDecoder('utf-8');

  const responseStr = textDecoder.decode(response.Payload);
  console.log('response: ', responseStr);
  totalDocsCreated++;
  console.log('totalDocsCreated: ', totalDocsCreated);
}

void main();
