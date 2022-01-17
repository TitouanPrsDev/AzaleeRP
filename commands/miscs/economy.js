const {connection} = require("../../config/database");
const {roles, channels} = require("../../config/config.json");
module.exports = {
    name: 'economy',
    aliases: [ 'eco' ],
    description: "Commandes relatives à l'économie",

    execute (client, message, args) {
        const { MessageEmbed } = require('discord.js')
        const { roles } = require('../../config/config.json')
        const { connection } = require('../../config/database')

        if (!args.length) {

        } else {
            switch (args[0]) {
                case 'money':

                    switch (args[1]) {
                        case 'balance':

                                if (!args[2]) {

                                    const id = message.author.id
                                    const username = message.author.username
                                    const discriminator = message.author.discriminator
                                    const avatar = message.author.displayAvatarURL()
                                    const messageDate = message.createdAt

                                    connection.query(`SELECT cash, bank FROM money WHERE players_id_FK = ${id}`, (err, res) => {
                                        if (err) throw err

                                        let cash = res[0].cash
                                        let bank = res[0].bank

                                        const messageEmbed = new MessageEmbed()
                                            .setColor("RANDOM")
                                            .setAuthor(`${username}#${discriminator}`, avatar)
                                            .setTitle("Mon solde")
                                            .addFields(
                                                { name: "Espèces :", value: `${cash} Skies`, inline: true},
                                                { name: "Banque :", value: `${bank} Skies`, inline: true},
                                                { name: "Total :", value: `${cash + bank} Skies`, inline: true}
                                            )
                                            .setFooter(`${messageDate.getDate() < 10 ? `0${messageDate.getDate()}` : messageDate.getDate()}/${messageDate.getMonth() + 1 < 10 ? `0${messageDate.getMonth() + 1}` : messageDate.getMonth() + 1}/${messageDate.getFullYear()} ${messageDate.getHours() < 10 ? `0${messageDate.getHours()}` : messageDate.getHours()}:${messageDate.getMinutes() < 10 ? `${messageDate.getHours()}` : messageDate.getHours()}`)

                                        message.channel.send(messageEmbed)
                                    })

                                } else if (args[2] && message.member.roles.cache.has(roles.staff)) {

                                    const id = args[2].substr(3, 18)
                                    const username = client.users.cache.find(user => user.id === id).username
                                    const discriminator = client.users.cache.find(user => user.id === id).discriminator
                                    const avatar = client.users.cache.find(user => user.id === id).displayAvatarURL()
                                    const messageDate = message.createdAt

                                    connection.query(`SELECT cash, bank FROM money WHERE players_id_FK = ${id}`, (err, res) => {
                                        if (err) throw err

                                        let cash = res[0].cash
                                        let bank = res[0].bank

                                        const messageEmbed = new MessageEmbed()
                                            .setColor("RANDOM")
                                            .setAuthor(`${username}#${discriminator}`, avatar)
                                            .setTitle("Solde du joueur")
                                            .addFields(
                                                { name: "Espèces :", value: `${cash} Skies`, inline: true},
                                                { name: "Banque :", value: `${bank} Skies`, inline: true},
                                                { name: "Total :", value: `${cash + bank} Skies`, inline: true}
                                            )
                                            .setFooter(`${messageDate.getDate() < 10 ? `0${messageDate.getDate()}` : messageDate.getDate()}/${messageDate.getMonth() + 1 < 10 ? `0${messageDate.getMonth() + 1}` : messageDate.getMonth() + 1}/${messageDate.getFullYear()} ${messageDate.getHours() < 10 ? `0${messageDate.getHours()}` : messageDate.getHours()}:${messageDate.getMinutes() < 10 ? `${messageDate.getHours()}` : messageDate.getHours()}`)

                                        message.channel.send(messageEmbed)
                                    })

                                } else {
                                    message.channel.send("**[ERREUR]** Vous n'avez pas la permission d'utiliser cette commande")
                                }

                                break

                        case 'give':

                            if (!args[2] || !args[3] || !Number.isInteger(parseInt(args[3], 10)) || args[3] <= 0) {
                                message.channel.send("**[ERREUR]** Arguments invalides")
                            } else {
                                const id = message.author.id
                                const idOther = args[2].substr(3, 18)

                                const date = message.createdAt

                                connection.query(`SELECT cash FROM money WHERE players_id_FK = ${id}`, (err, res) => {
                                    if (err) throw err

                                    if (res[0].cash < args[3]) {
                                        message.channel.send("**[ERREUR]** Vous ne possédez pas suffisamment d'argent en espèces")
                                    } else {

                                        connection.query(`UPDATE money SET cash = cash + ${args[3]} WHERE players_id_FK = ${idOther}`, (err, res) => {
                                            if (err) throw err
                                        })

                                        connection.query(`UPDATE money SET cash = cash - ${args[3]} WHERE players_id_FK = ${id}`, (err, res) => {
                                            if (err) throw err
                                        })

                                        message.channel.send("**[INFORMATION]** Le transfert d'argent a bien été effectué")

                                        client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** ${id} a envoyé ${args[3]} Skies à ${idOther}`)
                                    }
                                })
                            }

                            break

                        case 'add':

                            if (!message.member.roles.cache.has(roles.staff)) {
                                message.channel.send("**[ERREUR]** Vous n'avez pas la permission d'exécuter cette commande")
                            } else {

                                if (!args[2] || !args[3] || !args[4] || !Number.isInteger(parseInt(args[4], 10)) || args[4] <= 0) {
                                    message.channel.send("**[ERREUR]** Arguments invalides")

                                } else {
                                    const id = args[2].substr(3, 18)
                                    const date = message.createdAt

                                    connection.query(`UPDATE money SET ${args[3]} = ${args[3]} + ${args[4]} WHERE players_id_FK = ${id}`, (err, res) => {
                                        if (err) throw err

                                        message.channel.send("**[INFORMATION]** L'ajout d'argent a bien été effectué")

                                        client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** ${args[4]} ont été ajoutés au compte de ${id}`)
                                    })
                                }
                            }

                            break

                        case 'remove':

                            if (!message.member.roles.cache.has(roles.staff)) {
                                message.channel.send("**[ERREUR]** Vous n'avez pas la permission d'exécuter cette commande")
                            } else {

                                if (!args[2] || !args[3] || !args[4] || !Number.isInteger(parseInt(args[4], 10)) || args[4] <= 0) {
                                    message.channel.send("**[ERREUR]** Arguments invalides")

                                } else {
                                    const id = args[2].substr(3, 18)

                                    connection.query(`UPDATE money SET ${args[3]} = ${args[3]} - ${args[4]} WHERE players_id_FK = ${id}`, (err, res) => {
                                        if (err) throw err

                                        message.channel.send("**[INFORMATION]** Le retrait d'argent a bien été effectué")

                                        client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** ${args[4]} ont été supprimés du compte de ${id}`)
                                    })
                                }
                            }

                            break

                        case 'transfer':

                            if (!args[2] || (args[2] !== 'cash' && args[2] !== 'bank') || !args[3] || (args[3] !== 'cash' && args[3] !== 'bank') || !args[4] || !Number.isInteger(parseInt(args[4], 10)) || args[2] === args[3] || args[4] <= 0) {
                                message.channel.send("**[ERREUR]** Arguments invalides")
                            } else {

                                const id = message.author.id

                                connection.query(`SELECT ${args[2]} FROM money WHERE players_id_FK = ${id}`, (err, res) => {
                                    if (err) throw err

                                    let allowTransaction = false

                                    for (const prop in res[0]) {

                                        if (args[4] <= res[0][prop])
                                        allowTransaction = true

                                        console.log(res[0][prop], allowTransaction)
                                    }

                                    if (allowTransaction) {

                                        connection.query(`UPDATE money SET ${args[2]} = ${args[2]} - ${args[4]} WHERE players_id_FK = ${id}`, (err, res) => {
                                            if (err) throw err
                                        })

                                        connection.query(`UPDATE money SET ${args[3]} = ${args[3]} + ${args[4]} WHERE players_id_FK`, (err, res) => {
                                            if (err) throw err
                                        })

                                        message.channel.send("**[INFORMATION]** Le transfert d'argent a bien été effectué")

                                    } else {
                                        message.channel.send("**[ERREUR]** Vous ne possédez pas suffisamment d'argent sur votre compte de retrait")
                                    }
                                })
                            }

                            break

                        default:
                            message.channel.send("**[ERREUR]** Veuillez spécifier un argument valide")
                    }

                    break

                default:
                    message.channel.send("**[ERREUR]** Veuillez spécifier un argument valide")
            }
        }
    }
}
