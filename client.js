var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');
var StringBinding = require('sharedb-string-binding');


// Open WebSocket connection to ShareDB server
var socket = new ReconnectingWebSocket('ws://localhost:8080', [], {
  // ShareDB handles dropped messages, and buffering them while the socket
  // is closed has undefined behavior
  maxEnqueuedMessages: 0
});
var connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
var counter = connection.get('examples', 'counter');

/// ######### SETUP COUNTER ##########

// Get initial value of document and subscribe to changes
counter.subscribe(showNumbers);
counter.on('op', showNumbers);
function showNumbers() {
  console.log('data: ', counter.data);
  document.querySelector('#num-clicks').textContent = counter.data.numClicks;
};

// ########## SETUP TEXTAREA ##########
var textpad = document.querySelector('#textpad');
counter.subscribe(function(err) {
    if (err) throw err;
  
    var binding = new StringBinding(textpad, counter, ['content']);
    binding.setup();
  });

// HTML things

/// functions
function increment() {
    counter.submitOp([{p: ['numClicks'], na: 1}]);
}

// Expose to index.html
global.increment = increment;