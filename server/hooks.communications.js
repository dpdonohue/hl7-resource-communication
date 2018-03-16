import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';

import { Communications } from '../lib/Communications';

Communications.after.insert(function (userId, doc) {

  // HIPAA Audit Log
  HipaaLogger.logEvent({eventType: "create", userId: userId, userName: '', collectionName: "Communications"});

  // RELAY/SEND FUNCTIONALITY
  // interface needs to be active in order to send the messages
  if (Meteor.settings && Meteor.settings.public && Meteor.settings.public.interfaces && Meteor.settings.public.interfaces.default && Meteor.settings.public.interfaces.default.status && (Meteor.settings.public.interfaces.default.status === "active")) {
    HTTP.put(Meteor.settings.public.interfaces.default.channel.endpoint + '/Communication', {
      data: doc
    }, function(error, result){
      if (error) {
        console.log("POST /Communication", error);
      }
      if (result) {
        console.log("POST /Communication", result);
      }
    });
  }
});
Communications.after.update(function (userId, doc) {

  // HIPAA Audit Log
  HipaaLogger.logEvent({eventType: "update", userId: userId, userName: '', collectionName: "Communications"});

  // interface needs to be active in order to send the messages
  if (Meteor.settings && Meteor.settings.public && Meteor.settings.public.interfaces && Meteor.settings.public.interfaces.default && Meteor.settings.public.interfaces.default.status && (Meteor.settings.public.interfaces.default.status === "active")) {
    HTTP.post(Meteor.settings.public.interfaces.default.channel.endpoint + '/Communication', {
      data: doc
    }, function(error, result){
      if (error) {
        console.log("POST /Communication", error);
      }
      if (result) {
        console.log("POST /Communication", result);
      }
    });
  }
});
Communications.after.remove(function (userId, doc) {
  // ...
});
