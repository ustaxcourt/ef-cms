function User(petition) {
  this.name = petition.name;
}

User.prototype.isValid = function isValid() {
  return !!this.name;
};

export default User;
