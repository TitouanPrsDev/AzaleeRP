// noinspection SpellCheckingInspection, JSCheckFunctionSignatures

module.exports = {
    name: 'job',
    description: "Commandes relatives aux métiers",

    execute (client, message, args) {
        const { MessageEmbed } = require('discord.js')

        const categoriesMetiers = [
            "Alimentation",
            "Métaux",
            "Etoffes et habillement",
            "Bâtiments",
            "Enseignement et métiers intellectuels",
            "Sciences",
            "Divers"
        ]

        if (!args.length) { // Aucun argument
            const pages = [
                {
                    titre: categoriesMetiers[0],
                    description: "1 - Paysan\n\n2 - Vigneron\n\n3 - Boulanger\n\n4 - Boucher\n\n5 - Pêcheur\n\n6 - Chasseur\n\n7 - Marchand de vin\n\n8 - Cuisinier"
                },
                {
                    titre: categoriesMetiers[1],
                    description: "9 - Forgeron\n\n10 - Mineur"
                },
                {
                    titre: categoriesMetiers[2],
                    description: "11 - Tailleur\n\n12 - Cordonnier"
                },
                {
                    titre: categoriesMetiers[3],
                    description: "13 - Menuisier\n\n14 - Tailleur de pierre"
                },
                {
                    titre: categoriesMetiers[4],
                    description: "15 - Professeur"
                },
                {
                    titre: categoriesMetiers[5],
                    description: "16 - Scientifique/chimiste/ingénieur\n\n17 - Sage-femme/apothicaire\n\n18 - Mire/chirurgien"
                },
                {
                    titre: categoriesMetiers[6],
                    description: "19 - Nourrice\n\n20 - Tavernier/aubergiste\n\n21 - Chasseur de prime\n\n22 - Femme de joie"
                }
            ]
            let page = 1

            const messageEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(pages[page - 1].titre)
                .setDescription(pages[page - 1].description)
                .setFooter(`Page ${page}/${pages.length}`)

            message.channel.send(messageEmbed).then(msg => {
                msg.react('⏪').then(r => {
                    msg.react('⏩')

                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id

                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 })
                    const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 })

                    backwards.on('collect', r => {
                        if (page === 1) return
                        page--
                        messageEmbed.setTitle(pages[page - 1].titre)
                        messageEmbed.setDescription(pages[page - 1].description)
                        messageEmbed.setFooter(`Page ${page}/${pages.length}`)
                        msg.edit(messageEmbed)
                        msg.reactions.resolve('⏪').users.remove()
                    })

                    forwards.on('collect',r => {
                        if (page === pages.length) return
                        page++
                        messageEmbed.setTitle(pages[page - 1].titre)
                        messageEmbed.setDescription(pages[page - 1].description)
                        messageEmbed.setFooter(`Page ${page}/${pages.length}`)
                        msg.edit(messageEmbed)
                        msg.reactions.resolve('⏩').users.remove('')
                    })
                })
            })

        } else { // +1 argument
            const metiers = {
                paysan: {
                    id: 1,
                    nom: "Paysan",
                    categorie: categoriesMetiers[0],
                    description: "Le paysan vit à la campagne de ses activités agricoles.",
                    salaire: "5 Skies/semaine",
                    lieuTravail: "Champs derrière sa maison"
                },
                vigneron: {
                    id: 2,
                    nom: "Vigneron",
                    categorie: categoriesMetiers[0],
                    description: "Le vigneron cultive la vigne et transforme les raisins obtenus en vin.",
                    salaire: "20 Skies/semaine",
                    lieuTravail: "Vigne dans la ville de (...)"
                },
                boulanger: {
                    id: 3,
                    nom: "Boulanger",
                    categorie: categoriesMetiers[0],
                    description: "Le boulanger est la personne qui fabrique le pain.",
                    salaire: "En fonction de ses ventes - 10 Skies/semaine si aucune vente",
                    lieuTravail: "Boulangerie dans la capitale de (...)"
                },
                boucher: {
                    id: 4,
                    nom: "Boucher",
                    categorie: categoriesMetiers[0],
                    description: "Le boucher est la personne dont l'activité et l'abattage du bétail et la transformation des carcasses animales en viande détaillée.",
                    salaire: "20 Skies/semaine",
                    lieuTravail: "Boucherie dans la capitale de (...)"
                },
                pecheur: {
                    id: 5,
                    nom: "Pêcheur",
                    categorie: categoriesMetiers[0],
                    description: "Le pêcheur capture des poissons et autres animaux à partir de l'eau.",
                    salaire: "20 Skies/semaine",
                    lieuTravail: "Près d'un lac ou d'une rivière"
                },
                chasseur: {
                    id: 6,
                    nom: "Chasseur",
                    categorie: categoriesMetiers[0],
                    description: "La chasse est la traque d'animaux dans le but de les capturer ou de les abattre pour les manger ou les vendre, métier soumit à un passe de chasse obtensible à la mairie de (...) contre une somme d'argent.",
                    salaire: "En fonction de ses trouvailles",
                    lieuTravail: "Fôret, les champs ou les réserves de chasse"
                },
                marchandDeVin: { // TODO Métier en plusieurs mots (= plusieurs arguments)
                    id: 7,
                    nom: "Marchand de vin",
                    categorie: categoriesMetiers[0],
                    description: "Le marchand de vin vend le vin fabriqué par le vigneron.",
                    salaire: "20 Skies/semaine",
                    lieuTravail: "Marchés et comme vendeur aux porte à porte, pour vendre le vin aux auberges et tavernes"
                },
                cuisinier: {
                    id: 8,
                    nom: "Cuisinier",
                    categorie: categoriesMetiers[0],
                    description: "Il prépare à manger.",
                    salaire: "10 Skies/semaine",
                    lieuTravail: "Cuisine d'une auberge, d'une taverne ou encore des fameuses gargottes"
                },
                forgeron: {
                    id: 9,
                    nom: "Forgeron",
                    categorie: categoriesMetiers[1],
                    description: "Le forgeron est un ouvrier ou artisan professionnel qui forge à la main et assemble des pièces de métal pour réaliser des objets usuels (armes, outils, etc...) ou entrant dans la composition d'un bâtiment.",
                    salaire: "En fonction de ses ventes - 10 Skies/semaine si aucune vente",
                    lieuTravail: "Forge"
                },
                mineur: {
                    id: 10,
                    nom: "Mineur",
                    categorie: categoriesMetiers[1],
                    description: "Un mineur est une personne travaillant dans une mine pour y récupérer du minerais , équiper d'un passe obtensible à la mairie de (...) contre une somme d'argent.",
                    salaire: "En fonction de ses trouvailles",
                    lieuTravail: "Mine"
                },
                tailleur: {
                    id: 11,
                    nom: "Tailleur",
                    categorie: categoriesMetiers[2],
                    description: "Un artisan qui coupe et confectionne des vêtements — essentiellement des complets — sur mesure pour homme ou femme.",
                    salaire: "En fonction de ses ventes - 10 Skies/semaine si aucune vente",
                    lieuTravail: "Atelier dans la capitale de (...)"
                },
                cordonnier: {
                    id: 12,
                    nom: "Cordonnier",
                    categorie: categoriesMetiers[2],
                    description: "Personne qui répare ou confectionne des articles de cuir, principalement des chaussures mais s'a peut aller jusqu'à des accessoires comme des sacs.",
                    salaire: "En fonction de ses ventes - 20 Skies/semaine si aucune vente",
                    lieuTravail: "Cordonnerie"
                },
                menuisier: {
                    id: 13,
                    nom: "Menuisier",
                    categorie: categoriesMetiers[3],
                    description: "Personne dont le métier est de travailler le bois.",
                    salaire: "En fonction des ses ventes - 10 Skies/semaine si aucune vente",
                    lieuTravail: "Menuiserie"
                },
                tailleurDePierre: {
                    id: 14,
                    nom: "Tailleur de pierre",
                    categorie: categoriesMetiers[3],
                    description: "Ce travail consiste à fabriquer les pierres pour les murs des châteaux mais aussi les maisons.",
                    salaire: "50 Skies/semaine",
                    lieuTravail: "Atelier artisanal dans la ville"
                },
                professeur: {
                    id: 15,
                    nom: "Professeur",
                    categorie: categoriesMetiers[4],
                    description: "Personne qui enseigne un art ou qui dispense les connaissances relatives à une matière, à une discipline, en général dans le cadre d'une activité.",
                    salaire: "10 Skies/semaine",
                    lieuTravail: "Ecole"
                },
                scientifiqueChimisteIngenieur: {
                    id: 16,
                    nom: "Scientifique/chimiste/ingénieur",
                    categorie: categoriesMetiers[5],
                    description: "Les chimistes/scientifiques sont présents dans plusieurs domaines : matériaux, polymères, énergie, agro-alimentaire, sciences de la santé, pharmaceutique, optique, métallurgie, sciences de l'environnement. Ils sont accompagnés par un ingénieur pour mener à bien les expérience et création d'objet comme les lunettes de vue.",
                    salaire: "20 Skies/semaine",
                    lieuTravail: "Laboratoire"
                },
                sageFemmeApothicaire: {
                    id: 17,
                    nom: "Sage-femme/apothicaire",
                    categorie: categoriesMetiers[5],
                    description: "La sage-femme est une personne qui accompagne la femme tout au long de sa grossesse, de son diagnostic à l'accouchement et jusqu'au 7è jour de la vie du bébé. L'apothicaire est celui qui prépare et vend des médicaments naturel.",
                    salaire: "10 Skies/accouchement effectué (sage-femme) ou en fonction des ventes effectuées (apothicaire) - 7 Skies/semaine si aucun accouchement ou aucune vente",
                    lieuTravail: "Pharmacie avec cabinet médical"
                },
                mireChirurgien: {
                    id: 18,
                    nom: "Mire/chirurgien",
                    categorie: categoriesMetiers[5],
                    description: "Un médecin vient visiter un malade, observe les symptômes de son mal, lui prescrit un remède et est souvent amener a faire des opérations selon la plaie du patient.",
                    salaire: "15 Skies/semaine ou prix fixés par patient",
                    lieuTravail: "Pharmacie avec cabinet médical"
                },
                nourrice: {
                    id: 19,
                    nom: "Nourrice",
                    categorie: categoriesMetiers[6],
                    description: "Une nourrice permet à la mère d’enfanter de nouveau plus tôt et de s’assurer un héritier en gardant l'enfant au domicile des parents pour assurer une croissance dans de bonnes conditions.",
                    salaire: "5 Skies/enfant/jour",
                    lieuTravail: "Chez son client"
                },
                tavernierAubergiste: {
                    id: 20,
                    nom: "Tavernier/aubergiste",
                    categorie: categoriesMetiers[6],
                    description: "Personne tenant une taverne, c'est-à-dire un endroit où l'on sert à boire et parfois à manger (partie restauration), pour l'aubergiste c'est une personne qui tient une auberge avec des chambres à louer à la nuit ou à la semaine avec une partie de restauration pour les clients loger.",
                    salaire: "En fonction de ses ventes",
                    lieuTravail: "Taverne ou auberge"
                },
                chasseurDePrime: {
                    id: 21,
                    nom: "Chasseur de prime",
                    categorie: categoriesMetiers[6],
                    description: "Personne qui pourchasse des fugitifs ou des criminels pour obtenir une récompense, il peut parfois être amener à tuer des animaux/bêtes dits nuisibles.",
                    salaire: "En fonction des primes reçues",
                    lieuTravail: "Vagabonde tout le temps"
                },
                femmeDeJoie: {
                    id: 22,
                    nom: "Femme de joie",
                    categorie: categoriesMetiers[6],
                    description: "Se soumet aux autres afin de gagner leur vie en utilisant leur corps.",
                    salaire: "En fonction de ses prix",
                    lieuTravail: "Dans les ruelles sombres ou les bordels"
                }
            }

            for (let metier of Object.entries(metiers)) {
                if (metier[1].nom.toLowerCase().includes(args[0].toLowerCase())) { // TODO Ajouter fonctionnement avec id
                    const messageEmbed = new MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle(metier[1].nom)
                        .addFields(
                            { name: "Catégorie", value: metier[1].categorie },
                            { name: "Description", value: metier[1].description },
                            { name: "Salaire", value: metier[1].salaire },
                            { name: "Lieu de travail", value: metier[1].lieuTravail }
                        )

                    message.channel.send(messageEmbed)
                }
            }
        }
    }
}