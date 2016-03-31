JsonRoutes.Middleware.use(
  '/api/*',
  oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
);


JsonRoutes.add("get", "/PublicPatient/:id", function (req, res, next) {
  console.log('GET /PublicPatient/' + req.params.id);
  //console.log('res', res);

  var id = req.params.id;
  console.log('Patients.findOne(id)', Patients.findOne(id));

  if (typeof SiteStatistics === "object") {
    SiteStatistics.update({_id: "configuration"}, {$inc:{
      "Patients.count.read": 1
    }});
  }

  // because we're using BaseModel and a _transform() function
  // Patients returns an object instead of a pure JSON document
  // it stores a shadow reference of the original doc, which we're removing here
  var patientData = Patients.findOne(id);
  delete patientData._document;

  JsonRoutes.sendResult(res, {
    code: 200,
    data: patientData
  });
});


JsonRoutes.add("get", "/fhir/Patients/:id", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir/Patient/' + req.params.id);

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH) {
    process.env.TRACE && console.log('accessToken', accessToken);
    process.env.TRACE && console.log('accessToken.userId', accessToken.userId);

    if (typeof SiteStatistics === "object") {
      SiteStatistics.update({_id: "configuration"}, {$inc:{
        "Patients.count.read": 1
      }});
    }

    var id = req.params.id;
    var patientData = Patients.findOne(id);
    delete patientData._document;
    process.env.TRACE && console.log('patientData', patientData);

    JsonRoutes.sendResult(res, {
      code: 200,
      data: patientData
    });
  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});
