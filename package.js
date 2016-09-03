Package.describe({
  name: 'clinical:hl7-resource-patient',
  version: '1.3.2',
  summary: 'HL7 FHIR Resource - Patient',
  git: 'https://github.com/clinical-meteor/hl7-resource-patient',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('grove:less@0.1.1');


  api.use('meteor-platform');
  api.use('mongo');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('aldeed:collection2@2.3.3');
  api.use('simple:json-routes@2.1.0');
  api.use('prime8consulting:meteor-oauth2-server@0.0.2');

  api.use('clinical:extended-api@2.2.2');
  // api.use('clinical:router@2.0.17');
  api.use('clinical:base-model@1.3.5');
  api.use('clinical:hl7-resource-datatypes@0.4.2');

  // api.addFiles('client/components/patientUpsertPage/patientUpsertPage.html', ['client']);
  // api.addFiles('client/components/patientUpsertPage/patientUpsertPage.js', ['client']);
  // api.addFiles('client/components/patientUpsertPage/patientUpsertPage.less', ['client']);
  //
  // api.addFiles('client/components/patientsTablePage/patientsTablePage.html', ['client']);
  // api.addFiles('client/components/patientsTablePage/patientsTablePage.js', ['client']);
  // api.addFiles('client/components/patientsTablePage/patientsTablePage.less', ['client']);
  // api.addFiles('client/components/patientsTablePage/jquery.tablesorter.js', ['client']);
  //
  // api.addFiles('client/components/patientPreviewPage/patientPreviewPage.html', ['client']);
  // api.addFiles('client/components/patientPreviewPage/patientPreviewPage.js', ['client']);
  // api.addFiles('client/components/patientPreviewPage/patientPreviewPage.less', ['client']);
  //
  // api.addFiles('client/components/patientsListPage/patientsListPage.html', ['client']);
  // api.addFiles('client/components/patientsListPage/patientsListPage.js', ['client']);
  // api.addFiles('client/components/patientsListPage/patientsListPage.less', ['client']);

  //api.addFiles('server/methods.js', 'server');

  api.addFiles('lib/Patients.js');

  api.addFiles('server/rest.js', 'server');

  api.export("Patient");
  api.export('Patients');
  api.export('PatientSchema');
});
