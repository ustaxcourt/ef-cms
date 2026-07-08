import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { order } from './order';

const INDENT_CLASS = 'class="grant-deny-indent-paragraph"';

const buildPreamble = ({
  date,
  documentNumberText,
  motionTitle,
  movant,
}: {
  date: string;
  documentNumberText: string;
  motionTitle: string;
  movant: string;
}): string =>
  `<p ${INDENT_CLASS}>On ${date}, ${movant} filed a</p><p ${INDENT_CLASS}>${motionTitle} ${documentNumberText}. For cause, it is</p>`;

type OrderData = Parameters<typeof order>[0]['data'];

const generateGrantDenyMotionOrder = ({
  caseCaptionExtension = 'Petitioner(s)',
  caseTitle,
  docketNumberWithSuffix,
  orderContent,
}: {
  caseCaptionExtension?: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  orderContent: string;
}): ReturnType<typeof order> => {
  const data: OrderData = {
    addedDocketNumbers: [],
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    nameOfClerk: '',
    orderContent,
    orderTitle: 'ORDER',
    titleOfClerk: '',
  };

  return order({
    applicationContext,
    data,
  });
};

describe('Grant/Deny Motion orders', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Grant_Deny_Motion_Granted_Single_Petitioner.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      generateGrantDenyMotionOrder({
        caseTitle: 'Jane Doe',
        docketNumberWithSuffix: '123-26',
        orderContent: `${buildPreamble({
          date: 'March 15, 2026',
          documentNumberText: '(doc. no. 7)',
          motionTitle: 'Motion to Compel',
          movant: 'petitioner',
        })}

        <p ${INDENT_CLASS}>ORDERED that petitioner's Motion to Compel is granted. It is further</p>

        <p ${INDENT_CLASS}>ORDERED that this case is stricken from the September 15, 2026 Washington, DC trial session. It is further</p>

        <p ${INDENT_CLASS}>ORDERED that petitioner(s) shall file a status report by December 31, 2026.</p>`,
      }),
    testDescription:
      'generates a Grant/Deny Motion order granting a single petitioner motion',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Grant_Deny_Motion_Granted_Multiple_Petitioners.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      generateGrantDenyMotionOrder({
        caseTitle: 'Jane Doe & John Doe',
        docketNumberWithSuffix: '124-26',
        orderContent: `${buildPreamble({
          date: 'March 15, 2026',
          documentNumberText: '(doc. no. 11)',
          motionTitle: 'Motion for Continuance',
          movant: 'petitioners',
        })}

        <p ${INDENT_CLASS}>ORDERED that petitioner's Motion for Continuance is granted. It is further</p>

        <p ${INDENT_CLASS}>ORDERED that this case is restored to the general docket. It is further</p>

        <p ${INDENT_CLASS}>ORDERED that the parties shall file a joint status report or proposed stipulated decision by December 31, 2026. It is further</p>

        <p ${INDENT_CLASS}>ORDERED that the parties shall confer and file a proposed pretrial schedule.</p>`,
      }),
    testDescription:
      'generates a Grant/Deny Motion order granting a motion filed by one of multiple petitioners',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Grant_Deny_Motion_Granted_Respondent.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      generateGrantDenyMotionOrder({
        caseTitle: 'Jane Doe',
        docketNumberWithSuffix: '125-26',
        orderContent: `${buildPreamble({
          date: 'March 15, 2026',
          documentNumberText: '(doc. no. 14)',
          motionTitle: 'Motion to Dismiss',
          movant: 'respondent',
        })}

        <p ${INDENT_CLASS}>ORDERED that respondent's Motion to Dismiss is granted. It is further</p>

        <p ${INDENT_CLASS}>ORDERED that jurisdiction is retained by the undersigned.</p>`,
      }),
    testDescription:
      'generates a Grant/Deny Motion order granting a motion filed by respondent',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Grant_Deny_Motion_Denied_Single_Petitioner.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      generateGrantDenyMotionOrder({
        caseTitle: 'Jane Doe',
        docketNumberWithSuffix: '126-26',
        orderContent: `${buildPreamble({
          date: 'March 15, 2026',
          documentNumberText: '(doc. no. 7)',
          motionTitle: 'Motion to Compel',
          movant: 'petitioner',
        })}

        <p ${INDENT_CLASS}>ORDERED that petitioner's Motion to Compel is denied as moot without prejudice. It is further</p>

        <p ${INDENT_CLASS}>ORDERED that petitioner may renew the motion after the parties complete informal discovery.</p>`,
      }),
    testDescription:
      'generates a Grant/Deny Motion order denying a single petitioner motion as moot without prejudice',
  });
});
