const { Judge } = require('./Judge');
const { User } = require('./User');

describe('Judge', () => {
  it('initiates a valid Judge entity', () => {
    const judge = new Judge({
      contact: {
        address1: '1337 Leet St',
        address2: 'Clutch Suite',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'United States',
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      firstName: 'Guy',
      judgeFullName: 'Judge Guy Fieri',
      judgeTitle: 'Mayor of Flavortown',
      lastName: 'Fieri',
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });

    expect(judge.isValid()).toBeTruthy();
  });
});
