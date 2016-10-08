const WebSocket = require("ws"), request = require('request'), Zlib = require("zlib");
const ws = new WebSocket('wss://gateway.discord.gg/')

var EventEmitter, Promise;
EventEmitter = require("events").EventEmitter;
try {
    Promise = require("bluebird");
} catch(err) {
    Promise = global.Promise;
}
var url = ("https://discordapp.com/api")


/**
* DA CLIENT
* @extends EventEmitter
* @prop {String} token
*/
class Client extends EventEmitter {
    
	/**
	*	Client Constructorz
	*	@arg {String} token
	*	@returns {Client} Client object
	*/
    constructor(token) {
        super();
        
        this.token = token;
		
		request.get({ url: `${url}/gateway?encoding=json&v=6` }).on('response', function(response) { console.log(response.statusCode) })
   
    }
	connect() {

        Promise.resolve("wss://gateway.discord.gg/");
        var self = this;
		ws.on('open', function open() {
    		ws.send(JSON.stringify({
	            "op": 2,
	            "d": {
		            large_theshold: 250,
		            compress: true,
		            properties: {
			            $os: process ? process.platform : 'windows',
			            $browser: "discord.htc",
			            $device: "discord.htc",
			            $referrer: '',
			            $referring_domain: ''
		            },
		            token: self.token
	            }
            }))
		});
		
		ws.on("message", function(data, flags) {
            if (flags.binary)
                data = Zlib.inflateSync(data).toString();
                var message = JSON.parse(data);
                // do something with message
                if(message.s)
                    this.seq = message.s;
    		switch(message.t) {
                case "READY":
                    this.heartbeatInterval = setInterval(()=>{
                        ws.send(JSON.stringify({
                            op: 1,
                            d: this.seq
                        }))
                    }, message.d.heartbeat_interval);
            }
		});
		
	}
}



module.exports = Client;
