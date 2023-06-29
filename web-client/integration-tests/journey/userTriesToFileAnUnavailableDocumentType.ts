import { completeDocumentTypeSectionHelper as completeDocumentTypeSectionHelperComputed } from '../../src/presenter/computeds/completeDocumentTypeSectionHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const userTriesToFileAnUnavailableDocumentType = cerebralTest => {
  return it('user is unable to file a document type that is unavailable to external users', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const completeDocumentTypeSectionHelper = withAppContextDecorator(
      completeDocumentTypeSectionHelperComputed,
    );

    const completeDocumentTypeSection = runCompute(
      completeDocumentTypeSectionHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    const M123_document =
      completeDocumentTypeSection.documentTypesForSelectSorted.find(
        d => d.eventCode === 'M123',
      );

    expect(M123_document).toBeUndefined();
  });
};
