const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();

exports.handler = (event, context, cb) => {
    const params = {
      InstanceIds: [
         "i-03a36f72a7950f53a"
      ]
    };
    ec2.stopInstances(params, function(err, data) {
        if (err)
            console.log(err, err.stack) && cb(err);
        else
            console.log(data) && cb(null);
    });
};
