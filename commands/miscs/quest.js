// noinspection SpellCheckingInspection, JSCheckFunctionSignatures

const {roles, channels} = require("../../config/config.json");
const {connection} = require("../../config/database");
module.exports = {
    name: 'quest',
    aliases: [ 'q' ],
    description: "Commandes relatives aux quêtes",

    execute (client, message, args) {
        const { MessageEmbed } = require('discord.js')
        const { roles, channels } = require('../../config/config.json')
        const { connection } = require('../../config/database')

        if (!args.length) {

        } else {
            switch(args[0]) {
                case 'list':

                    connection.query(`SELECT id, name, objective, reward_money, reward_item FROM quests`, (err, res) => {
                        if (err) throw err

                        if (res.length === 0) {
                            message.channel.send("**[INFORMATION]** Aucune quête disponible")

                        } else {

                            const date = message.createdAt

                            const messageEmbed = new MessageEmbed()
                                .setColor("RANDOM")
                                .setTitle(`Quêtes journalières - ${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth()}/${date.getFullYear()}`)

                            for (let i = 0; i < res.length; i++) {
                                messageEmbed.addField(`${i + 1} - ${res[i].name.replaceAll('_', ' ')} (id : ${res[i].id})`, `**Objectif :** ${res[i].objective.replaceAll('_', ' ')}\n**Récompense :** ${res[i].reward_money === '/' && res[i].reward_item === '/' ? 'Aucune récompense' : (res[i].reward_money !== '/' && res[i].reward_item === '/' ? res[i].reward_money + ' Skies' : (res[i].reward_money === '/' && res[i].reward_item !== '/' ? res[i].reward_item : res[i].reward_money + ' Skies et ' + res[i].reward_item))}`)
                            }

                            message.channel.send(messageEmbed)
                        }
                    })

                    break

                case 'add':

                    if (!message.member.roles.cache.has(roles.staff)) {
                        message.channel.send("**[ERREUR]** Vous n'avez pas la permission d'exécuter cette commande")
                    } else {

                        if (!args[1] || !args[2] || !args[3] || !args[4] || args.length > 5 || (!Number.isInteger(parseInt(args[3], 10)) && args[3] !== '/') || !Number.isInteger(parseInt(args[4], 10)) || args[4] <= 0) { // TODO Vérifier chaine de caractère args[4]
                            message.channel.send("**[ERREUR]** Arguments invalides")

                        } else {

                            const date = message.createdAt

                            connection.query(`INSERT INTO quests (name, objective, reward_money, reward_item, date) VALUES ('${args[1]}', '${args[2]}', '${args[3]}', '${args[4]}', '${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getFullYear()}')`, (err, res) => {
                                if (err) throw err

                                message.channel.send("**[INFORMATION]** La quête a bien été ajoutée")

                                client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** Une quête a été ajoutée`)
                            })
                        }
                    }

                    break

                case 'remove':

                    if (!message.member.roles.cache.has(roles.staff)) {
                        message.channel.send("**[ERREUR]** Vous n'avez pas la permission d'exécuter cette commande")

                    } else {

                        if (!args[1] || !Number.isInteger(parseInt(args[1], 10))) {
                            message.channel.send("**[ERREUR]** Arguments invalides")

                        } else {

                            connection.query(`SELECT * FROM quests WHERE id = ${args[1]}`, (err, res) => {
                                if (err) throw err

                                if (res.length === 0) {
                                    message.channel.send("**[ERREUR]** Aucune quête ne correspond à cet identifiant")

                                } else {

                                    const date = message.createdAt

                                    connection.query(`DELETE FROM quests WHERE id = ${args[1]}`, (err, res) => {
                                        if (err) throw err

                                        message.channel.send("**[INFORMATION]** La quête a bien été supprimée")

                                        client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** Une quête a été supprimée`)
                                    })
                                }
                            })
                        }
                    }

                    break

                case 'clear':
                    if (!message.member.roles.cache.has(roles.staff)) {
                        message.channel.send("**ERREUR :** Vous n'avez pas la permission d'exécuter cette commande")

                    } else {

                        connection.query('SELECT id FROM quests', (err, res) => {
                            if (err) throw err

                            if (res.length === 0) {
                                message.channel.send("**INFORMATION :** Il n'existe aucune quête")

                            } else {

                                const date = message.createdAt

                                connection.query(`TRUNCATE TABLE quests`, (err, res) => {
                                    if (err) throw err

                                    message.channel.send("Toutes les quêtes ont été supprimées")

                                    client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** Toutes les quêtes ont été supprimées`)
                                })
                            }
                        })
                    }

                    break

                default:
                    message.channel.send("**[ERREUR]** Veuillez spécifier un argument valide")
            }
        }
    }
}
