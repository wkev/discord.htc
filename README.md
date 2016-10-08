![discord.htc logo](https://cdn.discordapp.com/attachments/216763379535052801/234375516742746112/Untitled-1.png)


##How to install

You will need node.js 4+ to run the library


####Main Version

```
npm install teamcorox/discord.htc
```
####Development Version (MORE BUGS)

```
npm install teamcorox/discord.htc#dev
```

###Bot Example

```js
const DHTC = require("discord.htc")
var bot = new DHTC("bot token")

var prefix = ("!")

bot.on("botReady", () => {
    console.log("Ready!")
});

bot.on("createdMessage", (message) => {
    if (message.content.startsWith(`${prefix}ping`)) {
        bot.makeMessage(message.channel_id, "pong")
    }
});

bot.connect();
```

##Progress on the Lib!

- [x] Client Struct
- [x] Message Struct
- [x] User Struct
- [x] Channel Struct
- [ ] Guild Struct


##Discord Server

https://discord.gg/hbKjYTu

###discord.htc &copy; TeamCoroX 2016
