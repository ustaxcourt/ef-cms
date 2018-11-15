function User(petition) {
  this.name = petition.name;
  this.role = petition.role;
}

User.prototype.isValid = function isValid() {
  return !!this.name && !!this.role;
};

module.exports = User;
