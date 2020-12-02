import { isCodeEnabled } from '../../../codeToggles';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOpinions = (test, testClient) => {
  return it('should view todays opinions', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoTodaysOpinionsSequence', {});

    expect(test.getState('todaysOpinions')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'T.C. Opinion',
          numberOfPages: 1,
        }),
      ]),
    );

    await test.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId: testClient.docketEntryId,
      docketNumber: testClient.docketNumber,
      isPublic: true,
    });

    if (isCodeEnabled(6841)) {
      expect(window.location.href).toContain(testClient.docketEntryId);
      window.location.href = undefined;
    } else {
      // this value is set in the mocked out window.open method in helpers.js
      expect(testClient.getState('openedUrl')).toBeDefined();
      testClient.setState('openedUrl', undefined);
    }
  });
};
