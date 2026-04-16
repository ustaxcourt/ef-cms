import type { Handler } from 'aws-lambda';
import { applicationContext } from '@web-api/applicationContext';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { generateStaleCasesReport } from '../../../../scripts/reports/stale-cases.helpers';
import { existsSync } from 'fs';
import { sendEmailWithAttachment } from '@web-api/dispatchers/ses/sendEmailWithAttachment';
import { rescheduleLambda } from '@web-api/dispatchers/sqs/rescheduleLambda';

const today = formatNow(FORMATS.YYYYMMDD);
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

type resultsType = { [recipient: string]: string } | string;

export const handler: Handler = async (event, _context) => {
  if (process.env.READ_ONLY_MODE === 'true') {
    await rescheduleLambda(applicationContext, { event }, 180);
    return succeed(
      'Skipping stale cases email cron due to read-only mode. Retrying in 180 seconds.',
    );
  }

  const commaDelimitedRecipients = process.env.INACTIVITY_REPORT_RECIPIENTS!;
  const recipients =
    commaDelimitedRecipients && commaDelimitedRecipients.length
      ? commaDelimitedRecipients.split(',')
      : [];
  if (!recipients.length) {
    return fail('No Recipients found.');
  }
  try {
    await generateStaleCasesReport({ filename });
  } catch (err) {
    const results = 'Unable to generate stale cases report.';
    return fail(results, err);
  }
  if (!existsSync(filename)) {
    return fail('Unable to generate stale cases report.');
  }
  const results: resultsType = {};
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
    return fail(results);
  } else {
    return succeed(results);
  }
};

const succeed = (results: resultsType) => {
  console.log(results);
  return results;
};

const fail = (results: resultsType, err?: unknown) => {
  if (err) {
    console.error(results, err);
  } else {
    console.error(results);
  }
  throw new Error(JSON.stringify(results));
};
