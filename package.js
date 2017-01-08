Package.describe({
  name: 'clinical:hl7-resource-patient',
  version: '1.6.36',
  summary: 'HL7 FHIR Resource - Patient',
  git: 'https://github.com/clinical-meteor/hl7-resource-patient',
  documentation: 'README.md'
});


Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('mongo');
  api.use('aldeed:simple-schema@1.3.3');
  //api.use('aldeed:collection2@2.5.0');
  api.use('simple:json-routes@2.1.0');
  api.use('prime8consulting:meteor-oauth2-server@0.0.2');
  api.use('momentjs:moment@2.17.1');

  api.use('clinical:extended-api@2.2.2');
  api.use('clinical:base-model@1.3.5');
  api.use('clinical:user-model@1.5.0');
  api.use('clinical:hl7-resource-datatypes@0.6.8');
  api.use('clinical:hl7-resource-bundle@1.3.9');

  api.imply('clinical:user-model');

  api.addFiles('lib/Patients.js');
  api.addFiles('server/rest.js', 'server');

  api.export('Patient');
  api.export('Patients');
  api.export('PatientSchema');
});
