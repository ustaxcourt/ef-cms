const pug = require('pug');
const fs = require('fs');

const data = {
  address1: '1889 Trails End Ct.',
  address2: 'Apt 42',
  city: 'Beverly Hills',
  docketNumber: '101-19',
  initialTitle:
    'Brett Osborne, Petitioner v. Commissioner of Internal Revenue, Respondent',
  petitionerNames: 'Brett Osborne',
  postalCode: '90210',
  procedureType: 'Regular',
  receivedDate: 'September 24, 2019',
  servedDate: 'October 4, 2019',
  state: 'CA',
  status: 'New',
  todaysDate: 'October 6, 2019',
  trialLocation: 'Birmingham, AL',
};

const compiledFunction = pug.compileFile('template.pug');
const html = compiledFunction(data);

fs.writeFile('index.html', html, () => {});
