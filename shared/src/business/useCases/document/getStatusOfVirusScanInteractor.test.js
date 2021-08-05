const {
  getStatusOfVirusScanInteractor,
} = require('./getStatusOfVirusScanInteractor');

describe('getStatusOfVirusScanInteractor', () => {
  it('should return true', () => {
    const result = getStatusOfVirusScanInteractor();

    expect(result).toBe(true);
  });
});
