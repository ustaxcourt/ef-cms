import { applicationContext } from '../../test/createTestApplicationContext';
import { generateNoticeOfDocketChangePdf } from './generateNoticeOfDocketChangePdf';
jest.mock('../../../authorization/authorizationClientService');
import { isAuthorized } from '../../../authorization/authorizationClientService';

const docketChangeInfo = {
  caseCaptionWithPostfix:
    'This is a Case Caption v. Commissioner of Internal Revenue, Respondent',
  docketEntryIndex: '3',
  docketNumber: '123-19X',
  filingParties: { after: 'Cody', before: 'Joe' },
  filingsAndProceedings: { after: 'Sausage', before: 'Pepperoni' },
};

describe('generateNoticeOfDocketChangePdf', () => {
  beforeEach(() => {
    isAuthorized.mockReturnValue(true);
    applicationContext.logger.error = jest.fn();
    applicationContext.getStorageClient.mockReturnValue({
      upload: (params, callback) => callback(null, true),
    });
  });

  it('requires permissions', async () => {
    isAuthorized.mockReturnValue(false);
    let result, error;
    try {
      result = await generateNoticeOfDocketChangePdf({
        applicationContext,
        docketChangeInfo,
      });
    } catch (err) {
      error = err;
    }
    expect(result).not.toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });

  it('calls the Notice of Docket Change document generator', async () => {
    applicationContext.getUniqueId.mockReturnValue('uniqueId');

    const result = await generateNoticeOfDocketChangePdf({
      applicationContext,
      docketChangeInfo,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange,
    ).toHaveBeenCalled();
    expect(result).toEqual('uniqueId');
  });

  it('fails and logs if the s3 upload fails', async () => {
    applicationContext.getStorageClient.mockReturnValue({
      upload: (params, callback) => callback('there was an error uploading'),
    });

    await expect(
      generateNoticeOfDocketChangePdf({
        applicationContext,
        docketChangeInfo,
      }),
    ).rejects.toEqual('there was an error uploading');
    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'An error occurred while attempting to upload to S3',
    );
    expect(applicationContext.logger.error.mock.calls[0][1]).toEqual(
      'there was an error uploading',
    );
  });
});
