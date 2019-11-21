const sinon = require('sinon');
const {
  submitCaseAssociationRequestInteractor,
} = require('./submitCaseAssociationRequestInteractor');
const { User } = require('../../entities/User');

describe('submitCaseAssociationRequest', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '123-19',
  };

  it('should throw an error when not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: User.ROLES.adc,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },

        getPersistenceGateway: () => ({
          getCaseByCaseId: async () => caseRecord,
          updateCase: async () => caseRecord,
          verifyCaseForUser: async () => true,
        }),
      };
      await submitCaseAssociationRequestInteractor({
        applicationContext,
        caseId: caseRecord.caseId,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should not add mapping if already there', async () => {
    let associateUserWithCaseSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(true);
    let updateCaseSpy = sinon.spy();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        createMappingRecord: associateUserWithCaseSpy,
        getCaseByCaseId: async () => caseRecord,
        getUserById: () => ({
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
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        updateCase: updateCaseSpy,
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await submitCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(associateUserWithCaseSpy.called).toEqual(false);
    expect(updateCaseSpy.called).toEqual(false);
  });

  it('should add mapping for a practitioner', async () => {
    let associateUserWithCaseSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(false);
    let updateCaseSpy = sinon.spy();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
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
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        associateUserWithCase: associateUserWithCaseSpy,
        getCaseByCaseId: async () => caseRecord,
        getUserById: () => ({
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
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        updateCase: updateCaseSpy,
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await submitCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(associateUserWithCaseSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
  });

  it('should add mapping for a respondent', async () => {
    let associateUserWithCaseSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(false);
    let updateCaseSpy = sinon.spy();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.respondent,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        associateUserWithCase: associateUserWithCaseSpy,
        getCaseByCaseId: async () => caseRecord,
        getUserById: () => ({
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
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        updateCase: updateCaseSpy,
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await submitCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(associateUserWithCaseSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
  });
});
