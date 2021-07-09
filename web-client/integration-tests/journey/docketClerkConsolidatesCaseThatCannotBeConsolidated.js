export const docketClerkConsolidatesCaseThatCannotBeConsolidated =
  cerebralTest => {
    return it('Docket clerk consolidates case that cannot be consolidated', async () => {
      cerebralTest.setState('modal.confirmSelection', true);
      await cerebralTest.runSequence('submitAddConsolidatedCaseSequence');

      expect(cerebralTest.getState('modal.showModal')).toBe(
        'AddConsolidatedCaseModal',
      );
      expect(cerebralTest.getState('modal.error')).toEqual([
        'Place of trial is not the same',
      ]);
      expect(
        cerebralTest.getState('caseDetail.consolidatedCases'),
      ).toBeUndefined();
    });
  };
