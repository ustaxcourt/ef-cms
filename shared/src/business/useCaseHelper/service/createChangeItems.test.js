const {
  createDocketEntryAndWorkItem,
  createDocketEntryForChange,
  createWorkItemForChange,
} = require('./createChangeItems');

describe('create change items', () => {
  it('is sane', () => {
    expect(createDocketEntryAndWorkItem).toBeDefined();
    expect(createDocketEntryForChange).toBeDefined();
    expect(createWorkItemForChange).toBeDefined();
  });
});
