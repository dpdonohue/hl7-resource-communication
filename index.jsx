

// import CommunicationDetail from './client/react/CommunicationDetail.js';
// import CommunicationPickList from './client/react/CommunicationPickList.js';
// import CommunicationsPage from './client/react/CommunicationsPage.js';
// import CommunicationTable from './client/react/CommunicationTable.js';
// import { insertCommunication, removeCommunicationById, updateCommunication } from './lib/methods.js';

import CommunicationsPage from './client/react/CommunicationsPage';
//import LandingPage from './client/react/LandingPage';

var DynamicRoutes = [{
  'name': 'CommunicationPage',
  'path': '/communications',
  'component': CommunicationsPage,
  'requireAuth': true
}];

// var DynamicRoutes = [];

var SidebarElements = [{
  'primaryText': 'Communications',
  'to': '/communications',
  'href': '/communications'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  CommunicationsPage,
  // CommunicationDetail,
  // CommunicationPickList,
  // CommunicationTable,

  // attach these to the Communication object, plz
  // insertCommunication, 
  // removeCommunicationById, 
  // updatePatien

  Communication,
  Communications,
  CommunicationSchema
};


