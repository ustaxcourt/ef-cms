const { DocketEntry } = require('./DocketEntry');

describe('isPending', () => {
  it('should return true if docketEntry is pending and is served', () => {
    const isPending = DocketEntry.isPending({
      pending: true,
      servedAt: '9000-01-01T00:00:00.000Z',
    });

    expect(isPending).toBeTruthy();
  });

  it('should return false if docketEntry is NOT pending and is served', () => {
    const isPending = DocketEntry.isPending({
      pending: false,
      servedAt: '9000-01-01T00:00:00.000Z',
    });

    expect(isPending).toBeFalsy();
  });

  it('should return true if docketEntry is pending and is a unservable document', () => {
    const isPending = DocketEntry.isPending({
      eventCode: 'HEAR',
      pending: true,
    });

    expect(isPending).toBeTruthy();
  });

  it('should return false if docketEntry is pending and is NOT unservable document', () => {
    const isPending = DocketEntry.isPending({
      eventCode: 'MISC',
      pending: true,
    });

    expect(isPending).toBeFalsy();
  });
});
