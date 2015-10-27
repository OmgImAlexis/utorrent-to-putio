var Client = require('utorrent-api'),
    PutIO = require('put.io-v2'),
    nconf = require('nconf');

nconf.use('memory');

nconf.argv().env().file({ file: './config.json' });

var api = new PutIO(nconf.get('putio:apikey'));

var utorrent = new Client(nconf.get('utorrent:host'), nconf.get('utorrent:port'));
utorrent.setCredentials(nconf.get('utorrent:user'), nconf.get('utorrent:pass'));

var logIt = (function(err, data){
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Removed ' + magnet);
    }
})();

utorrent.call('list', function(err, data) {
    if(err) { console.log(err); return; }

    var torrents = data.torrents;
    for(i = 0; i < torrents.length; i++) {
        var magnet = torrents[i][0];
        api.transfers.add(magnet);
        console.log('Sent ' + magnet + 'to Put.io');
        utorrent.call('remove', {hash: torrents[i][0]}, logIt(err, data));
    }
});
