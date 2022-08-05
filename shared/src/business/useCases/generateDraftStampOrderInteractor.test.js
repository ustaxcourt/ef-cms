const {
  generateDraftStampOrderInteractor,
} = require('./generateDraftStampOrderInteractor.js');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOTION_DISPOSITIONS } = require('../entities/EntityConstants.js');

describe('generateDraftStampOrderInteractor', () => {
  const docketNumber = '999-99';
  const formattedDraftDocumentTitle = 'Motion GRANTED';
  const motionDocketEntryId = '67fb412e-cb00-454c-9739-fa90a09dca1d';
  const parentMessageId = '4cfd6bf2-2252-473b-ae91-e34bcd0df55f';
  const stampData = { disposition: MOTION_DISPOSITIONS.GRANTED };
  const stampedDocketEntryId = 'e9bdeaa1-8c49-479e-9f21-6f3303307f48';

  it('should add a docket entry for the draft stamp order', async () => {
    await generateDraftStampOrderInteractor(applicationContext, {
      docketNumber,
      formattedDraftDocumentTitle,
      motionDocketEntryId,
      parentMessageId,
      stampData,
      stampedDocketEntryId,
    });

    expect(
      applicationContext.getUseCaseHelpers()
        .addDraftStampOrderDocketEntryInteractor,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCaseHelpers()
        .addDraftStampOrderDocketEntryInteractor.mock.calls[0][1],
    ).toEqual({
      docketNumber,
      formattedDraftDocumentTitle,
      originalDocketEntryId: motionDocketEntryId,
      parentMessageId,
      stampData,
      stampedDocketEntryId,
    });
  });

  it('should generate a stamped coversheet for the draft stamp order', async () => {
    await generateDraftStampOrderInteractor(applicationContext, {
      docketNumber,
      formattedDraftDocumentTitle,
      motionDocketEntryId,
      parentMessageId,
      stampData,
      stampedDocketEntryId,
    });

    expect(
      applicationContext.getUseCaseHelpers()
        .generateStampedCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().generateStampedCoversheetInteractor
        .mock.calls[0][1],
    ).toEqual({
      docketEntryId: motionDocketEntryId,
      docketNumber,
      stampData,
      stampedDocketEntryId,
    });
  });
});
