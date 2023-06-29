export const BOUNCE_NOTIFICATION = {
  bounce: {
    bounceSubType: 'General',
    bounceType: 'Permanent',
    bouncedRecipients: [
      {
        action: 'failed',
        diagnosticCode:
          'smtp; 550 5.4.1 Recipient address rejected: Access denied. ',
        emailAddress: 'somebody@example.com',
        status: '5.4.1',
      },
    ],
    feedbackId: '010001811a94f1fa',
    remoteMtaIp: '104.104.104.104',
    reportingMTA: 'dns; a8-62.smtp-out.amazonses.com',
    timestamp: '2022-05-31T14:46:17.000Z',
  },
  mail: {
    callerIdentity: 'lambda_role_dev',
    commonHeaders: {
      date: 'Tue, 31 May 2022 14:46:16 +0000',
      from: ['noreply@dev.ef-cms.example.com'],
      messageId: '<324173263.68350.1654008376621@ip-10-0-180-55.ec2.internal>',
      returnPath: 'noreply@dev.ef-cms.example.com',
      subject: 'ALERT: This is a bounced Email',
      to: ['somebody@example.com'],
    },
    destination: ['somebody@example.com'],
    headers: [
      { name: 'Return-Path', value: 'noreply@dev.ef-cms.example.com' },
      { name: 'Date', value: 'Tue, 31 May 2022 14:46:16 +0000' },
      { name: 'From', value: 'noreply@dev.ef-cms.example.com' },
      { name: 'To', value: 'somebody@example.com' },
      {
        name: 'Message-ID',
        value: '<324173263.68350.1654008376621@ip-10-0-180-55.ec2.internal>',
      },
      {
        name: 'Subject',
        value: 'ALERT: This is a bounced Email',
      },
      { name: 'MIME-Version', value: '1.0' },
      { name: 'Content-Type', value: 'text/html; charset=UTF-8' },
      { name: 'Content-Transfer-Encoding', value: '7bit' },
    ],
    headersTruncated: false,
    messageId: '010001811a94ec72-3af70ae1-6d47-4860-8d6d-ec576133f492-000000',
    sendingAccountId: '1231231231231',
    source: 'noreply@dev.ef-cms.example.com',
    sourceArn:
      'arn:aws:ses:us-east-1:1231231231231:identity/noreply@dev.ef-cms.example.com',
    sourceIp: '101.101.101.101',
    timestamp: '2022-05-31T14:46:16.434Z',
  },
  notificationType: 'Bounce',
};
