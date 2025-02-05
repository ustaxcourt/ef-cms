import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { applicationContext } from '@web-api/applicationContext';
import { basename } from 'path';
import { environment } from '@web-api/environment';
import { readFileSync } from 'fs';

export const sendEmailWithAttachment = async ({
  body,
  filePath,
  recipient,
  subject,
}: {
  body: string;
  filePath: string;
  recipient: string;
  subject: string;
}): Promise<boolean> => {
  if (!body || !filePath || !recipient || !subject) {
    console.error(
      'Error sending email: missing recipient, body, subject, or attachment.',
    );
    return false;
  }
  const sender = environment.emailFromAddress;
  const sesClient: SESClient = applicationContext.getEmailClient();
  const fileContent = readFileSync(filePath);
  let sent = false;

  const params = {
    RawMessage: {
      Data: buildRawEmail({
        body,
        fileContent,
        filename: basename(filePath),
        recipient,
        sender,
        subject,
      }),
    },
  };
  const rawEmailCommand = new SendRawEmailCommand(params);

  try {
    const result = await sesClient.send(rawEmailCommand);
    console.log('Email sent successfully:', result);
    sent = true;
  } catch (error) {
    console.error('Error sending email:', error);
  }

  return sent;
};

const buildRawEmail = ({
  body,
  fileContent,
  filename,
  recipient,
  sender,
  subject,
}: {
  body: string;
  fileContent: Buffer;
  filename: string;
  recipient: string;
  sender: string;
  subject: string;
}): Uint8Array => {
  const boundary = '----=_Part_0_123456789.123456789';
  const rawEmail = [
    `From: ${sender}`,
    `To: ${recipient}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    body,
    '',
    `--${boundary}`,
    `Content-Type: text/csv; name="${filename}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${filename}"`,
    '',
    fileContent.toString('base64'),
    '',
    `--${boundary}--`,
  ].join('\n');

  return Buffer.from(rawEmail, 'utf-8');
};
