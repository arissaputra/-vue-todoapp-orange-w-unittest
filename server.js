// server.js
let express = require('express');
let app = express();
let history = require('connect-history-api-fallback');
app.use(history({
    // verbose: true
}));
app.use(express.static(__dirname + '/dist'));
let port = process.env.PORT || 5000;
app.set('port', port);
app.listen(app.get('port'), () => {
  console.log(`ENV: ${process.env.NODE_ENV}`);
  console.log('server started '+ port);
});