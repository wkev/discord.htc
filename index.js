const Client = require("./code/Client");

function DHTC(token) {
	return new Client(token)
	/* discord.htc Client Passer */
}

const Message = require("./code/structs/Message");
const User = require("./code/structs/User");
const Channel = require("./code/structs/Channel");
const VoiceRegion = require("./code/structs/voice/VoiceRegion");

DHTC.Client = Client;
DHTC.Message = Message;
DHTC.User = User;
DHTC.Channel = Channel;
DHTC.VoiceRegion = VoiceRegion;

module.exports = DHTC;
