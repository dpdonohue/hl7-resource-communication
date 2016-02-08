Package.describe({
  name: 'clinical:hl7-resource-patient',
  version: '0.0.1',
  summary: 'HL7 FHIR Patient Resource',
  git: 'https://github.com/clinical-meteor/hl7-resource-patient',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('grove:less@0.1.1');

  api.use('clinical:router@2.0.17');
  api.use('clinical:active-layout@0.7.16');
  api.use('clinical:glass-ui@1.3.9');
  api.use('clinical:hl7-resource-datatypes@0.0.1');
  api.use('clinical:extended-api@2.2.2');


  api.addFiles('client/components/patientUpsertPage/patientUpsertPage.html', ['client']);
  api.addFiles('client/components/patientUpsertPage/patientUpsertPage.js', ['client']);
  api.addFiles('client/components/patientUpsertPage/patientUpsertPage.less', ['client']);

  api.addFiles('client/components/patientsTablePage/patientsTablePage.html', ['client']);
  api.addFiles('client/components/patientsTablePage/patientsTablePage.js', ['client']);
  api.addFiles('client/components/patientsTablePage/patientsTablePage.less', ['client']);
  api.addFiles('client/components/patientsTablePage/jquery.tablesorter.js', ['client']);

  api.addFiles('client/components/patientPreviewPage/patientPreviewPage.html', ['client']);
  api.addFiles('client/components/patientPreviewPage/patientPreviewPage.js', ['client']);
  api.addFiles('client/components/patientPreviewPage/patientPreviewPage.less', ['client']);

  api.addFiles('client/components/patientsListPage/patientsListPage.html', ['client']);
  api.addFiles('client/components/patientsListPage/patientsListPage.js', ['client']);
  api.addFiles('client/components/patientsListPage/patientsListPage.less', ['client']);

  //api.addFiles('server/methods.js', 'server');

  api.addFiles('lib/Patients.js');

  api.export('Patients');


});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('clinical:hl7-resource-patient');
});
