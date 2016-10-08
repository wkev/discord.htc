const WebSocket = require("ws"), request = require('request'), Zlib = require("zlib"), requestp = require('request-promise-any')
const ws = new WebSocket('wss://gateway.discord.gg/')

var EventEmitter, Promise;
EventEmitter = require("events").EventEmitter;
try {
    Promise = require("bluebird");
} catch(err) {
    Promise = global.Promise;
}
var url = ("https://discordapp.com/api")

const User = require("./structs/User");
const Message = require("./structs/Message")
const Channel = require("./structs/Channel")


/**
* DA CLIENT
* @extends EventEmitter
* @prop {String} token
* @prop {Number} startT
* @prop {Number} uptime
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
        this.startT = 0;
        this.isReady = false;
    
		
		request.get({ url: `${url}/gateway?encoding=json&v=6` }).on('response', function(response) {  })
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
           this.startT = Date.now();
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
                	self.emit("botReady")
                	this.isReady = true;
                    this.heartbeatInterval = setInterval(()=>{
                        ws.send(JSON.stringify({
                            op: 1,
                            d: this.seq
                        }))
                    }, message.d.heartbeat_interval);
                break;
                case "MESSAGE_CREATE":
                	self.emit("createdMessage", message.d)
                	this.author = new User(message.d.author);
                break;
                case "GUILD_CREATE":
                	self.emit("guildAdd", message.d)
                break;
            }
		});
	}
	
	get uptime() {
	    return (this.startT ? Date.now() - this.startT : 0);
	}

	/**
	* Make message in channel!
	* @arg {String} channelID The ID of a channel
	* @arg {String} content The content off the message
	*/
	
	makeMessage(channelID, content) {
		if (content == null) {
			return;
		}
		let options = {
    		method: 'POST',
			uri: `${url}/channels/${channelID}/messages`,
    		json: true, // Automatically stringifies the body to JSON
    		form: {
        		'content': `${content}`
    		},
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};
		return requestp(options).then((message) => { new Message(message, this) });
	}
}



module.exports = Client;
