const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticeOfDocketChangePdf,
} = require('./generateNoticeOfDocketChangePdf');
jest.mock('../../../authorization/authorizationClientService');
const {
  isAuthorized,
} = require('../../../authorization/authorizationClientService');

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
    applicationContext.getStorageClient.mockReturnValue({
      upload: (params, callback) => callback(),
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
});
