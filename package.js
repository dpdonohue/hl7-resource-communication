Package.describe({
  name: 'dpdonohue:hl7-resource-communication',
  version: '0.0.1',
  summary: 'HL7 FHIR Resource - Communication',
  git: 'https://github.com/dpdonohue/hl7-resource-communication',
  documentation: 'README.md'
});


Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('mongo');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('simple:json-routes@2.1.0');
  api.use('momentjs:moment@2.17.1');
  api.use('ecmascript');
  api.use('session');
  api.use('http');
  api.use('react-meteor-data');

  api.use('clinical:extended-api@2.2.2');
  api.use('clinical:base-model@1.3.5');
  api.use('clinical:user-model@1.5.0');
  api.use('clinical:hl7-resource-datatypes@3.0.0');
  api.use('clinical:hl7-resource-bundle@1.3.10');
  api.use('matb33:collection-hooks@0.7.15');

  api.imply('clinical:user-model');

  api.addFiles('lib/Communications.js');
  api.addFiles('server/rest.js', 'server');
  api.addFiles('server/hooks.communications.js', 'server');

  if(Package['clinical:fhir-vault-server']){
    api.use('clinical:fhir-vault-server@0.0.3', ['client', 'server'], {weak: true});
  }
  
  // these exports are put into the global context (but only on the server)
  api.export('Communication', 'server');
  api.export('Communications', 'server');
  api.export('CommunicationSchema', 'server');

  api.mainModule('index.jsx', 'client');
});


Npm.depends({
  "material-ui": "0.20.0",
  "lodash": "4.17.4"
});


