JsonRoutes.Middleware.use(
  '/api/*',
  oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
);



// this is temporary fix until PR 132 can be merged in
// https://github.com/stubailo/meteor-rest/pull/132

JsonRoutes.sendResult = function (res, options) {
  options = options || {};

  // Set status code on response
  res.statusCode = options.code || 200;

  // Set response body
  if (options.data !== undefined) {
    var shouldPrettyPrint = (process.env.NODE_ENV === 'development');
    var spacer = shouldPrettyPrint ? 2 : null;
    res.setHeader('Content-type', 'application/fhir+json');
    res.write(JSON.stringify(options.data, null, spacer));
  }

  // We've already set global headers on response, but if they
  // pass in more here, we set those.
  if (options.headers) {
    //setHeaders(res, options.headers);
    options.headers.forEach(function(value, key){
      res.setHeader(key, value);
    });
  }

  // Send the response
  res.end();
};

JsonRoutes.setResponseHeaders({
  "content-type": "application/fhir+json"
});


JsonRoutes.add("get", "/fhir/Patient/:id", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir/Patient/' + req.params.id);
  process.env.DEBUG && console.log('GET /fhir/Patient/' + req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

    if (accessToken) {
      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }

    // if (typeof SiteStatistics === "object") {
    //   SiteStatistics.update({_id: "configuration"}, {$inc:{
    //     "Patients.count.read": 1
    //   }});
    // }

    var patientData = Patients.findOne({_id: req.params.id});
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



JsonRoutes.add("get", "/fhir/Patient", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir/Patient', req.query);
  // console.log('GET /fhir/Patient', req.query);
  // console.log('process.env.DEBUG', process.env.DEBUG);

  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

    if (accessToken) {
      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }

    // if (typeof SiteStatistics === "object") {
    //   SiteStatistics.update({_id: "configuration"}, {$inc:{
    //     "Patients.count.search-type": 1
    //   }});
    // }

    var databaseQuery = {};

    if (req.query.family) {
      databaseQuery['name'] = {
        $elemMatch: {
          'family': req.query.family
        }
      };
    }
    if (req.query.given) {
      databaseQuery['name'] = {
        $elemMatch: {
          'given': req.query.given
        }
      };
    }
    if (req.query.name) {
      databaseQuery['name'] = {
        $elemMatch: {
          'text': req.query.name
        }
      };
    }
    if (req.query.identifier) {
      databaseQuery['identifier'] = {
        $elemMatch: {
          'value': req.query.identifier
        }
      };
    }
    if (req.query.gender) {
      databaseQuery['gender'] = req.query.gender;
    }
    if (req.query.birthdate) {
      databaseQuery['birthDate'] = req.query.birthdate;
    }

    //process.env.DEBUG && console.log('databaseQuery', databaseQuery);
    //process.env.DEBUG && console.log('Patients.find(id)', Patients.find(databaseQuery).fetch());

    // var searchLimit = 1;
    // var patientData = Patients.fetchBundle(databaseQuery);

    var payload = [];
    var patients = Patients.find(databaseQuery);

    patients.forEach(function(record){
      payload.push(Patients.prepForBundle(record));
    });


    JsonRoutes.sendResult(res, {
      code: 200,
      data: Bundle.generate(payload)
    });
  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});


JsonRoutes.add("post", "/fhir/Patient/:param", function (req, res, next) {
  process.env.DEBUG && console.log('POST /fhir/Patient/' + JSON.stringify(req.query));

  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

    if (accessToken) {
      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }

    var patients = [];

    if (req.params.param === '_search') {
      var searchLimit = 1;
      if (req && req.query && req.query._count) {
        searchLimit = parseInt(req.query._count);
      }
      patients = Patients.find({}, {limit: searchLimit});

      var payload = [];

      patients.forEach(function(record){
        payload.push(Patients.prepForBundle(record));
      });
    }

    //process.env.TRACE && console.log('patients', patients);

    JsonRoutes.sendResult(res, {
      code: 200,
      data: Bundle.generate(payload)
    });
  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});



JsonRoutes.add("post", "/fhir/Patient", function (req, res, next) {
  //process.env.DEBUG && console.log('POST /fhir/Patient/', JSON.stringify(req.body, null, 2));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

    if (accessToken) {
      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }

    var patientId;
    var newPatient;

    if (req.body) {
      newPatient = req.body;

      //PatientSchema.clean(newPatient);

      // FHIR v1.8.0
      // make sure names are properly formatted
      // newPatient.name.forEach(function(name){
      //   HumanName.clean(name);
      // });
      // newPatient.contact.forEach(function(contact){
      //   HumanName.clean(contact.name);
      // });

      // remove id and meta, if we're recycling a resource
      delete req.body.id;
      delete req.body.meta;

      newPatient = Patients.toMongo(newPatient);

      process.env.DEBUG && console.log('newPatient', JSON.stringify(newPatient, null, 2));
      // process.env.DEBUG && console.log('newPatient', newPatient);

      var patientId = Patients.insert(newPatient,  function(error, result){
        if (error) {
          JsonRoutes.sendResult(res, {
            code: 400
          });
        }
        if (result) {
          process.env.TRACE && console.log('result', result);
          res.setHeader("Location", "fhir/Patient/" + result);
          res.setHeader("Last-Modified", new Date());
          res.setHeader("ETag", "1.6.0");

          var patients = Patients.find({_id: result});
          var payload = [];

          patients.forEach(function(record){
            payload.push(Patients.prepForBundle(record));
          });

          //console.log("payload", payload);

          JsonRoutes.sendResult(res, {
            code: 201,
            data: Bundle.generate(payload)
          });
        }
      });
    } else {
      JsonRoutes.sendResult(res, {
        code: 422
      });

    }

  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});



JsonRoutes.add("delete", "/fhir/Patient/:id", function (req, res, next) {
  process.env.DEBUG && console.log('DELETE /fhir/Patient/' + req.params.id);

  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

    if (accessToken) {
      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }

    Patients.remove({_id: req.params.id}, function(error, result){
      if (result) {
        JsonRoutes.sendResult(res, {
          code: 204
        });
      }
      if (error) {
        JsonRoutes.sendResult(res, {
          code: 409
        });
      }
    });

  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});





// WebApp.connectHandlers.use("/fhir/Patient", function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   return next();
// });
