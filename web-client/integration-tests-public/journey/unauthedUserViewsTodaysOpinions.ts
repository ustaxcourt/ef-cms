import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOpinions = cerebralTest => {
  return it('should view todays opinions', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoTodaysOpinionsSequence', {});

    const todaysOpinions = cerebralTest.getState('todaysOpinions');

    expect(todaysOpinions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'T.C. Opinion',
          judge: 'Judge Pugh',
          numberOfPages: 1,
        }),
        expect.objectContaining({
          documentType: 'Order of Service of Transcript (Bench Opinion)',
          signedJudgeName: 'Maurice B. Foley',
        }),
      ]),
    );

    for (let todaysOpinion of todaysOpinions) {
      await cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
        docketEntryId: todaysOpinion.docketEntryId,
        docketNumber: todaysOpinion.docketNumber,
        isPublic: true,
        useSameTab: true,
      });

      expect(window.location.href).toContain(todaysOpinion.docketEntryId);
      window.location.href = undefined;
    }
  });
};
