
'use strict';

var FS = require('fs');
var EJS = require('ejs');

module.exports = function (grunt) {
  grunt.registerTask('kaltura_wrapper', 'A grunt plugin for generating wrappers the NYTimes API', function () {
    var config = grunt.config.get('kaltura_wrapper');
    config.wrapperOnly = true;
    console.log('dir:' + __dirname + '/../kaltura');
    var files = FS.readdirSync(__dirname + '/../kaltura');
    console.log('files;' + files.length);
    FS.mkdirSync(config.lucyDir);
    FS.mkdirSync(config.lucyDir + '/kaltura');
    for (var i = 0; i < files.length; ++i) {
      FS.createReadStream(__dirname + '/../kaltura/' + files[i]).pipe(FS.createWriteStream(config.lucyDir + '/kaltura/' + files[i]));
    }
    config.clientFile = 'kaltura-raw-api.js';

    EJS.renderFile(__dirname + '/templates/node/node.ejs', {}, function(err, rendered) {
      FS.writeFileSync(config.lucyDir + '/' + config.clientFile, rendered);

      grunt.file.expand(__dirname + '/../node_modules/lucy-rest-api-client/tasks').forEach(function(inpt) {console.log('tsk:' + inpt); grunt.loadTasks(inpt)});
      grunt.config('rest_api_client', {default_config: config});
      grunt.task.run('rest_api_client');
    });
  })
}
