import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

export const petitionerViewsCaseDetailAfterFilingDocument = (
  test,
  overrides = {},
) => {
  return it('petitioner views case detail after filing a document', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const docketNumberSuffix =
      overrides.docketNumberSuffix || DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;

    const caseDetail = test.getState('caseDetail');
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(caseDetail.docketNumber).toEqual(test.docketNumber);
    expect(caseDetail.docketNumberSuffix).toEqual(docketNumberSuffix);
    expect(caseDetailFormatted.docketNumberWithSuffix).toEqual(
      `${test.docketNumber}${docketNumberSuffix}`,
    );

    // verify that the user was given a link to their receipt
    expect(test.getState('alertSuccess.linkUrl')).toBeDefined();

    expect(caseDetail.documents.length).toEqual(6);

    //verify that the documents were added and served
    expect(caseDetail.documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ eventCode: 'P' }),
        expect.objectContaining({ eventCode: 'STIN' }),
        expect.objectContaining({
          eventCode: 'M014',
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          eventCode: 'AFF',
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          eventCode: 'STAT',
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          eventCode: 'DCL',
          servedAt: expect.anything(),
        }),
      ]),
    );
    expect(
      caseDetailFormatted.docketRecordWithDocument[1].record.eventCode,
    ).toEqual('RQT');
  });
};
