export const docketClerkVerifiesDocketEntryMetaUpdatesInEditForm =
  cerebralTest => {
    return it('docket clerk verifies docket entry meta updates in edit form', () => {
      expect(cerebralTest.getState('currentPage')).toEqual(
        'EditDocketEntryMeta',
      );

      expect(cerebralTest.getState('form.hasOtherFilingParty')).toBe(true);
      expect(cerebralTest.getState('form.otherFilingParty')).toBe(
        'Brianna Noble',
      );
    });
  };
