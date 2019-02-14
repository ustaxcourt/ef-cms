const { getUsersInSection } = require('../users/getUsersInSection.interactor');

exports.getInteractorForGetUsers = ({ section }) => {
  if (section) {
    return getUsersInSection;
  } else {
    throw new Error('invalid use case');
  }
};
