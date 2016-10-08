const Client = require("./code/Client");

function DHTC(token) {
	return new Client(token)
}

const Message = require("./code/structs/Message");
const User = require("./code/structs/User");
const Channel = require("./code/structs/Channel")

DHTC.Client = Client;
DHTC.Message = Message;
DHTC.User = User;
DHTC.Channel = Channel;

module.exports = DHTC;
