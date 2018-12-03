/**
 * constructor
 * @param petition
 * @constructor
 */
function User(petition) {
  Object.assign(this, petition);
}

/**
 * isValid
 * @returns {boolean}
 */
User.prototype.isValid = function isValid() {
  return !!this.userId && !!this.role;
};

module.exports = User;
