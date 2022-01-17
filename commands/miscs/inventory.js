const {roles, channels} = require("../../config/config.json");
const {MessageEmbed} = require("discord.js");
const {connection} = require("../../config/database");
module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    description: "Commandes relatives à l'inventaire des joueurs",

    execute (client, message, args) {
        const { MessageEmbed } = require('discord.js')
        const { connection } = require('../../config/database')

        if (!args.length) {

        } else {
            switch (args[0]) {
                case 'see':

                    if (!args[1]) {
                        const username = message.author.username
                        const discriminator = message.author.discriminator
                        const avatar = message.author.displayAvatarURL()
                        const messageDate = message.createdAt

                        const messageEmbed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(`${username}#${discriminator}`, avatar)
                            .setTitle("Mon inventaire")
                            .setFooter(`${messageDate.getDate() < 10 ? `0${messageDate.getDate()}` : messageDate.getDate()}/${messageDate.getMonth() + 1 < 10 ? `0${messageDate.getMonth() + 1}` : messageDate.getMonth() + 1}/${messageDate.getFullYear()} ${messageDate.getHours() < 10 ? `0${messageDate.getHours()}` : messageDate.getHours()}:${messageDate.getMinutes() < 10 ? `${messageDate.getHours()}` : messageDate.getHours()}`)

                        const id = message.author.id

                        connection.query(`SELECT id, name, amount FROM inventories WHERE players_id_FK = ${id}`, (err, res) => {
                            if (err) throw err

                            for (let i = 0; i < res.length; i++) {
                                messageEmbed.addField(`${i + 1} - ${res[i].name.replaceAll('_', ' ')} (id: ${res[i].id})`, `**Quantité :** ${res[i].amount}`)
                            }

                            message.channel.send(messageEmbed)
                        })

                    } else if (message.member.roles.cache.has(roles.staff) && args[1]) {

                        const userId = args[1].substr(3, 18)

                        const username = client.users.cache.find(user => user.id === userId).username
                        const discriminator = client.users.cache.find(user => user.id === userId).discriminator
                        const avatar = client.users.cache.find(user => user.id === userId).displayAvatarURL()
                        const messageDate = message.createdAt

                        const messageEmbed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(`${username}#${discriminator}`, avatar)
                            .setTitle("Mon inventaire")
                            .setFooter(`${messageDate.getDate() < 10 ? `0${messageDate.getDate()}` : messageDate.getDate()}/${messageDate.getMonth() + 1 < 10 ? `0${messageDate.getMonth() + 1}` : messageDate.getMonth() + 1}/${messageDate.getFullYear()} ${messageDate.getHours() < 10 ? `0${messageDate.getHours()}` : messageDate.getHours()}:${messageDate.getMinutes() < 10 ? `${messageDate.getHours()}` : messageDate.getHours()}`)

                        connection.query(`SELECT id, name, amount FROM inventories WHERE players_id_FK = ${userId}`, (err, res) => {
                            if (err) throw err

                            for (let i = 0; i < res.length; i++) {
                                messageEmbed.addField(`${i + 1} - ${res[i].name.replaceAll('_', ' ')} (id: ${res[i].id})`, `**Quantité :** ${res[i].amount}`)
                            }

                            message.channel.send(messageEmbed)
                        })

                    } else {
                        message.channel.send("**[ERREUR]** Vous n'avez pas la permission d'exécuter cette commande")
                    }

                    break

                case 'add':

                    if (!message.member.roles.cache.has(roles.staff)) {
                        message.channel.send("**[ERREUR]** Vous n'avez pas la permission d'exécuter cette commande")
                    } else {

                        if (!args[1] || !args[2] || !args[3] || !Number.isInteger(parseInt(args[3], 10)) || args[3] <= 0 || args.length > 4) {
                            message.channel.send("**[ERREUR]** Arguments invalides")
                        } else {

                            const userId = args[1].substr(3, 18)

                            connection.query(`SELECT id, name FROM inventories WHERE players_id_FK = ${userId}`, (err, res) => {
                                if (err) throw err

                                if (res.length >= 25) {
                                    message.channel.send("**[ERREUR]** Il y a trop d'objets dans l'inventaire du joueur")
                                } else {

                                    let exists = false
                                    let itemId

                                    for (let i = 0; i < res.length; i++) {
                                        if (res[i].name === args[2]) {
                                            exists = true
                                            itemId = res[i].id
                                            break
                                        }
                                    }

                                    const date = message.createdAt

                                    if (exists) {

                                        connection.query(`UPDATE inventories SET amount = amount + ${args[3]} WHERE id = ${itemId}`, (err, res) => {
                                            if (err) throw err

                                            message.channel.send("**[INFORMATION]** Les objets ont été ajoutés à l'inventaire")

                                            client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** ${args[3]} ${args[2].replaceAll('_', '')} ont été ajoutés à l'inventaire de <@${userId}>`)
                                        })

                                    } else {

                                        connection.query(`INSERT INTO inventories (players_id_FK, name, amount) VALUES ('${userId}', '${args[2]}', ${args[3]})`, (err, res) => {
                                            if (err) throw err

                                            message.channel.send("**[INFORMATION]** Les objets ont été ajoutés à l'inventaire")

                                            client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** ${args[3]} ${args[2].replaceAll('_', '')} ont été ajoutés à l'inventaire de <@${userId}>`)
                                        })
                                    }
                                }
                            })
                        }
                    }

                    break

                case 'remove':

                    if (!message.member.roles.cache.has(roles.staff)) {
                        message.channel.send("**[ERREUR]** Vous n'avez pas la permission d'exécuter cette commande")
                    } else {

                        connection.query(`SELECT amount FROM inventories WHERE id = ${args[1]}`, (err, res) => {
                            if (err) throw err

                            if (!args[1] || !args[2] || !Number.isInteger(parseInt(args[1], 10)) || !Number.isInteger(parseInt(args[2], 10)) || args[2] <= 0 || res[0].amount < args[2]) {
                                message.channel.send("**[ERREUR]** Arguments invalides")
                            } else {

                                const date = message.createdAt

                                if (res[0].amount - args[2] === 0) {

                                    connection.query(`DELETE FROM inventories WHERE id = ${args[1]}`, (err, res) => {
                                        if (err) throw err

                                        message.channel.send("**[INFORMATION]** Les objets ont été supprimés")

                                        client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** ${args[3]} ${args[2].replaceAll('_', '')} ont été supprimés de l'inventaire de <@${userId}>`)
                                    })

                                } else {

                                    connection.query(`UPDATE inventories SET amount = amount - ${args[2]} WHERE id = ${args[1]}`, (err, res) => {
                                        if (err) throw err

                                        message.channel.send("**[INFORMATION]** Les objets ont été supprimés")
                                    })
                                }
                            }
                        })

                    }

                    break

                /*case 'request':

                    if (!args[1] || !args[2] || !args[3]) {

                        console.error("Syntaxe : -inventory request <nom_item> <nombre_items> <lieu_recuperation_item>")

                        if (!args[1]) {
                            console.error("Veuillez spécifier un nom d'objet")
                        } else if (!args[2]) {
                            console.error("Veuiller spécifier un nombre d'objets à ajouter")
                        } else if (!args[3]) {
                            console.error("Veuillez spécifier un lieu de récupération de l'objet")
                        }
                    } else {
                        message.channel.send("Votre demande d'ajout d'objet a été envoyée au staff")

                        const username = message.author.username
                        const discriminator = message.author.discriminator
                        const avatar = message.author.displayAvatarURL()
                        const messageDate = message.createdAt

                        const messageEmbed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(`${username}#${discriminator}`, avatar)
                            .setTitle("Demande d'ajout d'objet")
                            .addFields(
                                { name: "Nom objet :", value: `${args[1]}`},
                                { name: "Quantité :", value: `${args[2]}`},
                                { name: "Lieu de récupération :", value: `${args[3]}`}
                            )
                            .setFooter(`${messageDate.getDate()}/${messageDate.getMonth() + 1 < 10 ? `0${messageDate.getMonth() + 1}` : messageDate.getMonth() + 1}/${messageDate.getFullYear()} à ${messageDate.getHours()}:${messageDate.getMinutes()}`)

                        client.channels.cache.get(channels.demandeAjoutObjet)
                            .send(messageEmbed)
                            .then(message => {
                                message.react('✅')

                                message.react('❎')

                                // TODO Collector reactions : https://discordjs.guide/popular-topics/collectors.html#basic-reaction-collector
                            })
                    }

                    break*/

                default:
                    message.channel.send("**[ERREUR]** Veuillez spécifier un argument valide")
            }
        }
    }
}
