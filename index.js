const Client = require("./code/Client");

function DHTC(token) {
	return new Client(token)
}

const Message = require("./code/structs/Message");

DHTC.Client = Client;
DHTC.Message = Client;

module.exports = DHTC;
