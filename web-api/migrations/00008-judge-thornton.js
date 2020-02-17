const { upGenerator } = require('./utilities');

const mutateRecord = item => {
  let itemUpdated = false;
  // User record
  if (item.pk === 'thortonsChambers|user') {
    item.pk = 'thorntonsChambers|user';
    itemUpdated = true;
  }

  // Section mapping record
  if (item.pk === 'section-thortonsChambers') {
    item.pk = 'section-thorntonsChambers';
    itemUpdated = true;
  }

  // Section
  if (item.section === 'thortonsChambers') {
    item.section = 'thorntonsChambers';
    itemUpdated = true;
  }

  // Judge field
  if (item.judge && item.judge.section === 'thortonsChambers') {
    item.judge.section = 'thorntonsChambers';
    itemUpdated = true;
  }

  return itemUpdated && item;
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
