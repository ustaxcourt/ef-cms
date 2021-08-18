const {
  activateAdminAccount,
  createAdminAccount,
  createDawsonUser,
  deactivate,
  enableUser,
} = require('../shared/admin-tools/user/admin');
const { doStuff } = require('./create-and-enable-smoketest-user');
jest.mock('../shared/admin-tools/user/admin', () => ({
  activateAdminAccount: jest.fn(),
  createAdminAccount: jest.fn(),
  createDawsonUser: jest.fn(),
  deactivate: jest.fn(),
  enableUser: jest.fn(),
}));

const mockBaseUser = {
  birthYear: '1950',
  contact: {
    address1: '234 Main St',
    address2: 'Apartment 4',
    address3: 'Under the stairs',
    city: 'Chicago',
    countryType: 'domestic',
    phone: '+1 (555) 555-5555',
    postalCode: '61234',
    state: 'IL',
  },
  employer: '',
  lastName: 'Test',
  password: 'password1234',
  suffix: '',
};

const user = {
  ...mockBaseUser,
  email: 'testAdmissionsClerk@example.com',
  name: 'Test admissionsclerk',
  role: 'admissionsclerk',
  section: 'admissions',
};

describe('create and enable smoketest user', () => {
  it('should create, activate, and deactivate the admin user', async () => {
    await doStuff();

    expect(createAdminAccount).toHaveBeenCalled();
    expect(activateAdminAccount).toHaveBeenCalled();
    expect(deactivate).toHaveBeenCalled();
  });

  it('should create the smoketest user', async () => {
    await doStuff();

    expect(createDawsonUser).toHaveBeenCalled();
    expect(enableUser).toHaveBeenCalled();
  });

  it('should log and exit with an error code when anything fails', async () => {
    createDawsonUser.mockRejectedValue(new Error('oh no!'));

    await doStuff();

    expect(createDawsonUser).toHaveBeenCalled();
    expect(enableUser).toHaveBeenCalled();
  });
});
