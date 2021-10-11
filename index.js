// noinspection SpellCheckingInspection

const Discord = require('discord.js')
const fs = require('fs')

const { prefix, token, channels } = require('./config/config.json')
const { connection } = require('./config/database.js')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFolders = fs.readdirSync('./commands')

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`)
        client.commands.set(command.name, command)
    }
}

client.once('ready', () => {
    console.log("Bot ready !")

    connection.connect(err => {
        if (err) throw err
        console.log("Connected to the database !")
    })
})

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return

    try {
        command.execute(client, message, args)
    } catch (error) {
        console.error(error)
        message.reply("Une erreur s'est produite lors de l'exécution de cette commande !")
    }
})

client.on("guildMemberAdd", member => {

    client.channels.cache.get(channels.bienvenue).send(`Bonjour/bonsoir jeune arrivant <@${member.user.id}>, et bienvenue sur le serveur !\nPour accéder au RP, je te propose de regarder <#866748804174577684>, <#866748737930133525>, <#866750665312043009>!\nN'hésite pas aussi à faire un tour sur le wiki du serveur !\nhttps://azalee-rp.fandom.com/fr/wiki/`)

    connection.query(`SELECT id FROM players`, (err, res) => {
        if (err) throw err

        let exists = false

        for (let i = 0; i < res.length; i++) {
            if (res[i].id === member.user.id) {
                exists = true
                break
            }
        }

        if (!exists) {
            connection.query(`INSERT INTO players (id) VALUES ('${member.user.id}')`, (err, res) => {
                if (err) throw err
            })

            connection.query(`INSERT INTO money (players_id_FK) VALUES ('${member.user.id}')`, (err, res) => {
                if (err) throw err
            })

        }
    })
})

client.on('guildMemberRemove', member => {
    let username = member.user.username
    let discriminator = member.user.discriminator

    client.channels.cache.get(channels.aurevoir).send(`${username}#${discriminator} vient de quitter le serveur !`)
})

client.login(token)