// noinspection SpellCheckingInspection, JSCheckFunctionSignatures

const {channels} = require("../../config/config.json");
module.exports = {
    name: 'clear',
    aliases: [ 'c' ],
    description: "Commandes relatives à la suppression de messages",

    execute (client, message, args) {

        if (!args.length) {
            message.channel.send("**Erreur :** Veuillez spécifier un nombre de messages à supprimer")

        } else if (Number.isInteger(parseInt(args[0], 10)) && args[0] >= 1 && args[0] <= 100) {
            const date = message.createdAt

            message.channel.bulkDelete(parseInt(args[0], 10))

            client.channels.cache.get(channels.logsCommandes).send(`**${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `${date.getHours()}` : date.getHours()}:${date.getSeconds() < 10 ? `${date.getSeconds()}` : date.getSeconds()}** ${args[0]} messages ont été supprimés du channel ${message.guild.channels.cache.get(message.channel.id).toString()}`)

        } else {
            message.channel.send("**Erreur :** Veuillez spécifier une valeur numérique ou un nombre compris entre 1 et 100")
        }
    }
}