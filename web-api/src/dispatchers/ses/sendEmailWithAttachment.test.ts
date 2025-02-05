import {
  type SendRawEmailCommandOutput,
  type SESClient,
} from '@aws-sdk/client-ses';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { cloneDeep } from 'lodash';
import { existsSync } from 'fs';
import { sendEmailWithAttachment } from './sendEmailWithAttachment';
import { v4 } from 'uuid';

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');
  return {
    __esModule: true,
    ...originalModule,
    existsSync: jest.fn().mockReturnValue(true),
    readFileSync: jest.fn().mockReturnValue(Buffer.from('test\nfile', 'utf8')),
  };
});
const mockExistsSync = existsSync as jest.Mock;

const applicationContext = {
  environment: {
    emailFromAddress: 'noreply-jest@example.com',
    stage: 'jest',
  },
  getEmailClient: jest.fn().mockReturnValue({
    send: jest
      .fn()
      .mockResolvedValue({ MessageId: v4() } as SendRawEmailCommandOutput),
  } as unknown as SESClient),
} as unknown as ServerApplicationContext;

const mockEmail = {
  body: 'Jest: Test email with attachment',
  contentType: 'text/csv',
  filePath: '/tmp/test.csv',
  recipient: 'jest@example.com',
  subject: 'Jest: Test email',
};

describe('sendEmailWithAttachment', () => {
  it.each(['body', 'contentType', 'filePath', 'recipient', 'subject'])(
    'throws if %s is empty',
    async key => {
      const itsEmail = cloneDeep(mockEmail);
      delete itsEmail[key];
      let errorMessage: string = '';
      try {
        await sendEmailWithAttachment({ applicationContext, ...itsEmail });
      } catch (err: any) {
        errorMessage = err.message;
      }
      expect(errorMessage).toEqual(
        'Error sending email: missing recipient, body, subject, or attachment.',
      );
      expect(applicationContext.getEmailClient().send).not.toHaveBeenCalled();
    },
  );

  it('throws if the attachment does not exist', async () => {
    mockExistsSync.mockReturnValueOnce(false);
    let errorMessage: string = '';
    try {
      await sendEmailWithAttachment({ applicationContext, ...mockEmail });
    } catch (err: any) {
      errorMessage = err.message;
    }
    expect(errorMessage).toEqual('Error sending email: attachment not found.');
    expect(applicationContext.getEmailClient().send).not.toHaveBeenCalled();
  });

  it('sends an email with an attachment', async () => {
    await sendEmailWithAttachment({ applicationContext, ...mockEmail });
    expect(applicationContext.getEmailClient().send).toHaveBeenCalledTimes(1);
  });
});
