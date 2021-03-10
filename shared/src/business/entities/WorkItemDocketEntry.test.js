const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const { WorkItemDocketEntry } = require('./WorkItemDocketEntry');

describe('WorkItemDocketEntry', () => {
  it('should white lists the fields set within the entity, removing those not defined', () => {
    const mockDocketEntry = MOCK_DOCUMENTS[0];

    const workItemDocketEntry = new WorkItemDocketEntry(mockDocketEntry);

    expect(workItemDocketEntry.getFormattedValidationErrors()).toBe(null);
    expect(workItemDocketEntry.filedBy).toBeUndefined();
    expect(workItemDocketEntry.editState).toBeUndefined();
    expect(workItemDocketEntry.editState).toBeUndefined();
    expect(workItemDocketEntry.documentTitle).toBe(
      MOCK_DOCUMENTS[0].documentTitle,
    );
  });
});
