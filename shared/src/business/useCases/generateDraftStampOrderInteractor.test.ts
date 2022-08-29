import { MOTION_DISPOSITIONS, ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { generateDraftStampOrderInteractor } from './generateDraftStampOrderInteractor';

describe('generateDraftStampOrderInteractor', () => {
  let mockCurrentUser;
  const docketNumber = '999-99';
  const formattedDraftDocumentTitle = 'Motion GRANTED';
  const motionDocketEntryId = '67fb412e-cb00-454c-9739-fa90a09dca1d';
  const parentMessageId = '4cfd6bf2-2252-473b-ae91-e34bcd0df55f';
  const stampData = { disposition: MOTION_DISPOSITIONS.GRANTED };
  const stampedDocketEntryId = 'e9bdeaa1-8c49-479e-9f21-6f3303307f48';

  beforeEach(() => {
    mockCurrentUser = {
      role: ROLES.judge,
      userId: '8675309b-18d0-43ec-bafb-654e83405411',
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    mockCurrentUser = {
      role: ROLES.petitioner,
      userId: '8675309b-18d0-43ec-bafb-654e83405411',
    };

    await expect(
      generateDraftStampOrderInteractor(applicationContext, {
        docketNumber,
        formattedDraftDocumentTitle,
        motionDocketEntryId,
        parentMessageId,
        stampData,
        stampedDocketEntryId,
      }),
    ).rejects.toThrow('Unauthorized');
  });

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
