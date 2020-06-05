const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const app = express();
const router = express.Router();

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

router.post('/', (req, res) => {
  console.log(req.apiGateway);
  console.log(req.body);
  res.json({
    apiGateway: req.apiGateway,
    body: req.body,
  });
});

app.use('/', router);

exports.app = app;
