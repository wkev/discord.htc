const Client = require('./code/Client')
const Message = require('./code/structs/Message')
const User = require('./code/structs/User')
const Channel = require('./code/structs/Channel')
const VoiceRegion = require('./code/structs/voice/VoiceRegion')

function DHTC (token) {
  return new Client(token)
/* discord.htc Client Passer */
}

DHTC.Client = Client
DHTC.Message = Message
DHTC.User = User
DHTC.Channel = Channel
DHTC.VoiceRegion = VoiceRegion

module.exports = DHTC
