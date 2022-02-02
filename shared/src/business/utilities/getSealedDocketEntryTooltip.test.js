const {
  getSealedDocketEntryTooltip,
} = require('./getSealedDocketEntryTooltip');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DOCKET_ENTRY_SEALED_TO_TYPES } = require('../entities/EntityConstants');

describe('getSealedDocketEntryTooltip', () => {
  it('returns "Sealed to the public" when the docket entry has been sealed to the public', () => {
    const entry = {
      sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    };

    const sealedTo = getSealedDocketEntryTooltip(applicationContext, entry);

    expect(sealedTo).toEqual('Sealed to the public');
  });

  it('returns "Sealed to the public and parties of this case" when the docket entry has been sealed to external users', () => {
    const entry = {
      sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
    };

    const sealedTo = getSealedDocketEntryTooltip(applicationContext, entry);

    expect(sealedTo).toEqual('Sealed to the public and parties of this case');
  });
});
