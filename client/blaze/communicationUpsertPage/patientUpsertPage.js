Session.setDefault('communicationReadOnly', true);


Router.map(function () {
  this.route('newCommunicationRoute', {
    path: '/insert/communication',
    template: 'communicationUpsertPage',
    onAfterAction: function () {
      Session.set('communicationReadOnly', false);
    }
  });

});
Router.route('/upsert/communication/:id', {
  name: 'upsertCommunicationRoute',
  template: 'communicationUpsertPage',
  data: function () {
    return Communications.findOne(this.params.id);
  },
  onAfterAction: function () {
    Session.set('communicationReadOnly', false);
  }
});
Router.route('/view/communication/:id', {
  name: 'viewCommunicationRoute',
  template: 'communicationUpsertPage',
  data: function () {
    return Communications.findOne(this.params.id);
  },
  onAfterAction: function () {
    Session.set('communicationReadOnly', true);
  }
});


//-------------------------------------------------------------


Template.communicationUpsertPage.helpers({
  getName: function(){
    return this.name[0].text;
  },
  getEmailAddress: function () {
    if (this.telecom && this.telecom[0] && (this.telecom[0].system === "email")) {
      return this.telecom[0].value;
    } else {
      return "";
    }
  },
  isNewCommunication: function () {
    if (this._id) {
      return false;
    } else {
      return true;
    }
  },
  isReadOnly: function () {
    if (Session.get('communicationReadOnly')) {
      return 'readonly';
    }
  },
  getCommunicationId: function () {
    if (this._id) {
      return this._id;
    } else {
      return '---';
    }
  }
});

Template.communicationUpsertPage.events({
  'click #removeUserButton': function () {
    Communications.remove(this._id, function (error, result) {
      if (error) {
        console.log("error", error);
      };
      if (result) {
        Router.go('/list/communications');
      }
    });
  },
  'click #saveUserButton': function () {
    //console.log( 'this', this );

    Template.communicationUpsertPage.saveCommunication(this);
    Session.set('communicationReadOnly', true);
  },
  'click .barcode': function () {
    // TODO:  refactor to Session.toggle('communicationReadOnly')
    if (Session.equals('communicationReadOnly', true)) {
      Session.set('communicationReadOnly', false);
    } else {
      Session.set('communicationReadOnly', true);
      console.log('Locking the communication...');
      Template.communicationUpsertPage.saveCommunication(this);
    }
  },
  'click #lockCommunicationButton': function () {
    //console.log( 'click #lockCommunicationButton' );

    if (Session.equals('communicationReadOnly', true)) {
      Session.set('communicationReadOnly', false);
    } else {
      Session.set('communicationReadOnly', true);
    }
  },
  'click #communicationListButton': function (event, template) {
    Router.go('/list/communications');
  },
  'click .imageGridButton': function (event, template) {
    Router.go('/grid/communications');
  },
  'click .tableButton': function (event, template) {
    Router.go('/table/communications');
  },
  'click #previewCommunicationButton': function () {
    Router.go('/customer/' + this._id);
  },
  'click #upsertCommunicationButton': function () {
    console.log('creating new Communications...');
    Template.communicationUpsertPage.saveCommunication(this);
  }
});


Template.communicationUpsertPage.saveCommunication = function (communication) {
  // TODO:  add validation functions

  if (communication._id) {
    var communicationOptions = {
      communicationname: $('#communicationnameInput').val(),
      emails: [{
        address: $('#communicationEmailInput').val()
      }],
      profile: {
        fullName: $('#communicationFullNameInput').val(),
        avatar: $('#communicationAvatarInput').val(),
        description: $('#communicationDescriptionInput').val()
      }
    };

    Communications.update({
      _id: communication._id
    }, {
      $set: communicationOptions
    }, function (error, result) {
      if (error) console.log(error);
      Router.go('/view/communication/' + communication._id);
    });

    if (communication.emails[0].address !== $('#communicationEmailInput')
      .val()) {
      var options = {
        communicationId: communication._id,
        email: $('#communicationEmailInput')
          .val()
      };
      Meteor.call('updateEmail', options);
    }


  } else {
    var communicationOptions = {
      communicationname: $('#communicationnameInput').val(),
      email: $('#communicationEmailInput').val(),
      profile: {
        fullName: $('#communicationFullNameInput').val(),
        avatar: $('#communicationAvatarInput').val(),
        description: $('#communicationDescriptionInput').val()
      }
    };
    //console.log( 'communicationOptions', communicationOptions );

    communicationOptions.password = $('#communicationnameInput')
      .val();
    Meteor.call('addUser', communicationOptions, function (error, result) {
      if (error) {
        console.log('error', error);
      }
      if (result) {
        console.log('result', result);
        Router.go('/view/communication/' + result);
      }
    });

  }
};
