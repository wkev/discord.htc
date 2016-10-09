'use strict'

/**
* @prop {String} id The guild ID
* @prop {String} name The guild name
* @prop {String} icon The guild icon
* @prop {String} region The guild region
* @prop {String} owner_id The guild's owner's ID
* @prop {Array} roles The guild's roles
* @prop {Array} emojis The guilds custom emojis
*/

class Guild {
  constructor (data) {
    this.id = data.id
    this.name = data.name
    this.icon = data.icon
    this.region = data.region
    this.owner_id = data.owner_id
    this.roles = data.roles
    this.emojis = data.emojis
  }
}

module.exports = Guild
