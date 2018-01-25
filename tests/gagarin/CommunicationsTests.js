describe('clinical:hl7-resources-communications', function () {
  var server = meteor();
  var client = browser(server);

  it('Communications should exist on the client', function () {
    return client.execute(function () {
      expect(Communications).to.exist;
    });
  });

  it('Communications should exist on the server', function () {
    return server.execute(function () {
      expect(Communications).to.exist;
    });
  });

});
