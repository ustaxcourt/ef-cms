import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, irsSuperuserUser } from '../../../test/mockUsers';
import { generateNoticeOfDocketChangePdf } from './generateNoticeOfDocketChangePdf';

describe('generateNoticeOfDocketChangePdf', () => {
  const docketChangeInfo = {
    caseCaptionExtension:
      'Bert & Ernie, Petitioners v. Commissioner of Internal Revenue, Respondent',
    caseTitle: 'Bert & Ernie',
    docketEntryIndex: '3',
    docketNumber: '123-19X',
    filingParties: { after: 'Cody', before: 'Joe' },
    filingsAndProceedings: { after: 'Sausage', before: 'Pepperoni' },
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext.getStorageClient.mockReturnValue({
      upload: (params, callback) => callback(null, true),
    });
  });

  it('should throw an error when the user does not have permission to generate a notice of docket change', async () => {
    applicationContext.getCurrentUser.mockReturnValue(irsSuperuserUser); // IRS Superuser does not have this permission

    await expect(
      generateNoticeOfDocketChangePdf({
        applicationContext,
        docketChangeInfo,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call the document generator to create the Notice of Docket Change PDF', async () => {
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

  it('should log an error when the generated PDF can`t be uploaded to s3', async () => {
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
