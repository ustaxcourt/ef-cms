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

let createDawsonUserMock = jest.fn();
let enableUserMock = jest.fn();

describe('create and enable smoketest user', () => {
  it('should create the smoketest user', () => {
    expect(createDawsonUserMock).toHaveBeenCalled();
  });

  it('should enable the smoketest user', () => {
    expect(enableUserMock).toHaveBeenCalled();
  });
});
