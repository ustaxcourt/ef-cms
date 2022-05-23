const deepFreeze = require('deep-freeze');

const CHRONOLOGICALLY_ASCENDING = 'Oldest to newest';
const CHRONOLOGICALLY_DESCENDING = 'Newest to oldest';
const ALPHABETICALLY_ASCENDING = 'In A-Z ascending order';
const ALPHABETICALLY_DESCENDING = 'In Z-A descending order';

module.exports = deepFreeze({
  ALPHABETICALLY_ASCENDING,
  ALPHABETICALLY_DESCENDING,
  CHRONOLOGICALLY_ASCENDING,
  CHRONOLOGICALLY_DESCENDING,
});
