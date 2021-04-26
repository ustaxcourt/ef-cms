/**
 * attaches an IRS practitioner to the case
 *
 * @param {string} practitioner the irsPractitioner to add to the case
 */
exports.attachIrsPractitioner = function (practitioner) {
  this.irsPractitioners.push(practitioner);
};
