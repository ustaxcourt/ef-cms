const PetitionerPrimaryContact = require('./PetitionerPrimaryContact');
const PetitionerDeceasedSpouseContact = require('./PetitionerDeceasedSpouseContact');
const PetitionerSpouseContact = require('./PetitionerSpouseContact');
const PetitionerCorporationContact = require('./PetitionerCorporationContact');

// TODO; currently ignored in package.json jest config
const ContactFactory = {
  addContacts: (partyType, obj) => {
    const contactProps = ['contactPrimary', 'contactSecondary'];
    const contactMap = {
      Petitioner: [PetitionerPrimaryContact],
      'Petitioner & Deceased Spouse': [
        PetitionerPrimaryContact,
        PetitionerDeceasedSpouseContact,
      ],
      'Surviving Spouse': [
        PetitionerPrimaryContact,
        PetitionerDeceasedSpouseContact,
      ],
      'Petitioner & Spouse': [
        PetitionerPrimaryContact,
        PetitionerSpouseContact,
      ],
      Corporation: [PetitionerCorporationContact],
      'Partnership (as the tax matters partner)': [
        PetitionerPrimaryContact,
        PetitionerCorporationContact,
      ],
      'Partnership (as a partner other than tax matters partner)': [
        PetitionerPrimaryContact,
        PetitionerCorporationContact,
      ],
      'Estate with Executor/Personal Representative/Etc.': [
        PetitionerCorporationContact,
      ],
      'Estate without Executor/Personal Representative/Etc.': [
        PetitionerCorporationContact,
      ],
    };

    const constructors = contactMap[partyType];

    if (!constructors) {
      throw new Error(`Unrecognized partyType ${this.partyType}`);
    }

    constructors.forEach((contactConstructor, idx) => {
      const contactProperty = contactProps[idx];
      obj[contactProperty] = new contactConstructor(obj[contactProperty] || {});
    });
  },
};

module.exports = ContactFactory;
