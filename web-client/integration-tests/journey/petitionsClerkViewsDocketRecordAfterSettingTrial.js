import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkViewsDocketRecordAfterSettingTrial = (
  test,
  overrides = {},
) => {
  return it('Petitions clerk views docket record for a case after calendaring', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const docketEntries = test.getState('caseDetail.docketEntries');

    const noticeOfTrial = docketEntries.find(
      entry =>
        entry.documentType ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
    );

    const standingPretrialDocTitle =
      overrides.documentTitle ||
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentTitle;

    const standingPretrialDoc = docketEntries.find(
      entry => entry.documentTitle === standingPretrialDocTitle,
    );

    expect(noticeOfTrial).toBeTruthy();
    expect(standingPretrialDoc).toBeTruthy();
    expect(standingPretrialDoc.eventCode).toBe(
      overrides.eventCode ||
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
    );
  });
};
