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
const Guild = require("./structs/Guild")


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
    }
	connect() {
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
		return requestp(options).then((message) => { new Message(message, this) }).catch(function (err) { return Promise.reject(new Error("No permission in channel to Send Message")) });
	}
	snipMessage(channelID, messageID) {
		let options = {
    			method: 'DELETE',
			uri: `${url}/channels/${channelID}/messages/${messageID}`,
    			headers: {
        			'Authorization': `Bot ${this.token}`
    			}
		};	
		return requestp(options).catch(function (err) { return Promise.reject(new Error("No permission in channel to Delete Message")); });
	}

	/**
	* Remove a message!
	* @arg {String} channelID The ID of a channel
	* @arg {String} messageID The ID of a Message
	*/
	
	snipMessage(channelID, messageID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/channels/${channelID}/messages/${messageID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("No permission in channel to Delete Message")); });
	}
	
	changeGame(botGame) {
		if (botGame !== undefined) {
			this.game = botGame;
		}
		ws.send(JSON.stringify({
			op: 3,
			d: { 
				"idle_since": "", 
				"game": {
					"name": `${botGame}`	
				}
			}
    	}))
	}
	
	makeChannel(serverID, channame, chantype) {
		let options = {
    		method: 'POST',
			uri: `${url}/guilds/${serverID}/channels`,
			body: {
				"name": `${channame}`,
				"type": `${chantype}`
			},
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		},
    		json: true // Automatically stringifies the body to JSON
		};
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("No permission to create channel or undefined channel type")); });
	}
	
	makeGuildRole(serverID) {
		let options = {
    		method: 'POST',
			uri: `${url}/guilds/${serverID}/roles`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("No permission to create role!")); });
	}

	snipGuildRole(serverID, roleID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/guilds/${serverID}/roles/${roleID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("No permission) to delete role!")); });
	}
}



module.exports = Client;
