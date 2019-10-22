const pug = require('pug');
const fs = require('fs');

const data = {
  docketNumber: '101-19',
  initialTitle:
    'Brett Osborne, Petitioner v. Commissioner of Internal Revenue, Respondent',
  procedureType: 'Regular',
  status: 'New',
};

const compiledFunction = pug.compileFile('template.pug');
const html = compiledFunction(data);

fs.writeFile('index.html', html, () => {});
