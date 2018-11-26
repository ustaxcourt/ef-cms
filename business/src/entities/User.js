function User(petition) {
  Object.assign(this, petition);
}

User.prototype.isValid = function isValid() {
  return !!this.userId && !!this.role;
};

module.exports = User;
