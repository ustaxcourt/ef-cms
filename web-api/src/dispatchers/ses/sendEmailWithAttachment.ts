import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { basename } from 'path';
import { existsSync, readFileSync } from 'fs';

export const sendEmailWithAttachment = async ({
  applicationContext,
  body,
  contentType,
  filePath,
  recipient,
  subject,
}: {
  applicationContext: ServerApplicationContext;
  body: string;
  contentType: string;
  filePath: string;
  recipient: string;
  subject: string;
}): Promise<void> => {
  if (!body || !contentType || !filePath || !recipient || !subject) {
    throw new Error(
      'Error sending email: missing recipient, body, subject, or attachment.',
    );
  }
  if (!existsSync(filePath)) {
    throw new Error('Error sending email: attachment not found.');
  }
  const sender = applicationContext.environment.emailFromAddress;
  const sesClient: SESClient = applicationContext.getEmailClient();
  const fileContent = readFileSync(filePath);

  const params = {
    RawMessage: {
      Data: buildRawEmail({
        body,
        contentType,
        fileContent,
        filename: basename(filePath),
        recipient,
        sender,
        subject,
      }),
    },
  };
  const rawEmailCommand = new SendRawEmailCommand(params);

  const result = await sesClient.send(rawEmailCommand);
  console.log('Email sent:', result);
};

const buildRawEmail = ({
  body,
  contentType,
  fileContent,
  filename,
  recipient,
  sender,
  subject,
}: {
  body: string;
  contentType: string;
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
    `Content-Type: ${contentType}; name="${filename}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${filename}"`,
    '',
    fileContent.toString('base64'),
    '',
    `--${boundary}--`,
  ].join('\n');

  return Buffer.from(rawEmail, 'utf-8');
};
