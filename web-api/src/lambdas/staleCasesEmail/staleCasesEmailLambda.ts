import type { Handler } from 'aws-lambda';
import { applicationContext } from '@web-api/applicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { generateStaleCasesReport } from '../../../../scripts/reports/stale-cases.helpers';
import { existsSync } from 'fs';
import { sendEmailWithAttachment } from '@web-api/dispatchers/ses/sendEmailWithAttachment';

const today = createISODateString().split('T')[0];
const filename = `/tmp/12-month-inactivity_${today}.csv`;
const subject = `12 Month Inactivity List - ${today}`;
const body =
  'Attached is a DAWSON-generated list of cases that have had no ' +
  'activity in DAWSON for at least 365 days. There should be no issue with ' +
  'most or all of the cases listed; but it is also possible that an error ' +
  'occurred. If a case is on this list and you believe it was included in ' +
  'error, please let Case Services know.\n\n' +
  'If your mail program does not open this file automatically (usually by ' +
  'double clicking), you can open the file with Excel. The file is sorted ' +
  'first by judge and then by number of days since the last activity. ' +
  '"Chief Judge" indicates cases in the General Docket.\n\n' +
  'Thank You,\nThe DAWSON Team';

export const handler: Handler = async (_event, context) => {
  const commaDelimitedRecipients = process.env.INACTIVITY_REPORT_RECIPIENTS!;
  const recipients =
    commaDelimitedRecipients && commaDelimitedRecipients.length
      ? commaDelimitedRecipients.split(',')
      : [];
  if (!recipients.length) {
    return fail({ context, results: 'No Recipients found.' });
  }
  try {
    await generateStaleCasesReport({ applicationContext, filename });
  } catch (err) {
    const results = 'Unable to generate stale cases report.';
    console.error(results, err);
    return fail({ context, results });
  }
  if (!existsSync(filename)) {
    return fail({ context, results: 'Unable to generate stale cases report.' });
  }
  const results = {};
  for (const recipient of recipients) {
    let result: string;
    try {
      await sendEmailWithAttachment({
        applicationContext,
        body,
        contentType: 'text/csv',
        filePath: filename,
        recipient,
        subject,
      });
      result = 'sent';
    } catch (err) {
      console.error('Unable to send email: ', err);
      result = 'error';
    }
    results[recipient] = result;
  }
  if (Object.values(results).filter(res => res === 'error').length) {
    return fail({ context, results });
  } else {
    return succeed({ context, results });
  }
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};

const fail = ({ context, results }) => {
  console.error(results);
  return context.fail(results);
};
