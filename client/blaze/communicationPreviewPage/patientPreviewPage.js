
Router.map(function(){
  this.route('communicationPreviewPage', {
    path: '/communication/:id',
    template: 'communicationPreviewPage',
    data: function () {
      return Communications.findOne({_id: this.params.id});
    }
  });
});


Template.communicationPreviewPage.events({
  "click .listButton": function(event, template){
    Router.go('/list/communications');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/communications');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/communications');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/communications');
  },
  "click .communicationId": function(){
    Router.go('/upsert/communication/' + this._id);
  }
});
