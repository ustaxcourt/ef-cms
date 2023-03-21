const { getUniqueId } = require('../sharedAppContext');
const { User } = require('../business/entities/User');

const [email, role, section, name, judgeFullName, judgeTitle] =
  process.argv.slice(2);

const user = new User({
  email,
  judgeFullName,
  judgeTitle,
  name,
  role,
  section,
  userId: getUniqueId(),
});

if (!user.isValid()) {
  console.error(
    'Validation errors: ',
    user.getValidationErrors(),
    JSON.stringify(user.toRawObject(), null, 2),
  );
  process.exit(1);
}
