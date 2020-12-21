//-------------Discord.js------
const Discord = require("discord.js")
const config = require("./config.json")
const bot = new Discord.Client()
//-------------Lowdb--------
const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

//-------------Lowdb--------
const dbdb = new FileSync("db.json")
const db = low(dbdb)

db.defaults({Infos_membres: []}).write()

//------ Connection------
bot.login(config.token)
bot.on("ready" , async message => {
    console.log("je suis prêt !")
})

bot.on("guildMemberAdd", async member => {
    let bienvenue = bot.guilds.caches.get("788415622488129556").channels.cache.get("789328358982942751")
    
    member.roles.add("788868722629541909")
    
    bienvenue.send(`Bienvenue ${member} sur le serveur !`)

})

bot.on("message", async message => {
    let msgauthorid = message.author.id

    if(!db.get("Infos_membres").find({id: msgauthorid}).value()){
        db.get("Infos_membres").push({id: msgauthorid, xp: 1, niveau: 1,xp_p_niveau: 50}).write()
        console.log("ça marche !")
    }else{
        let userxpdb = db.get("Infos_membres").filter({id: msgauthorid}).find("xp").value()
        let userxp = Object.values(userxpdb)
        let userniveaudb = db.get("Infos_membres").filter({id: msgauthorid}).find("niveau").value()
        let userniveau = Object.values(userniveaudb)
        let userpniveaudb = db.get("Infos_membres").filter({id: msgauthorid}).find("xp_p_niveau").value()
        let userpniveau = Object.values(userpniveaudb)

        let chiffre = [3, 4, 5, 6, 7]
        let index = Math.floor(Math.random() * (chiffre.length - 1) + 1)

        db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp: userxp[1] += chiffre[index]}).write()

        if(userxp[1] >= userniveau[3]){
            db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp: userxp[1] = 1}).write()
            db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, niveau: userniveau[2] += 1}).write()
            db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp_p_niveau: userpniveau[3] += 20}).write()
            message.channel.send(`GG ${message.author} tu viens de levelup (${userniveau[2]}) !`)
        }
    }
})

bot.on("message", async message => {
    if(message.content === "ping"){
        let embed = new Discord.MessageEmbed()
        .addField("Message detecté !", "Réponse : **Pong**")
        .setColor("#FF000B")
        message.channel.send(embed)
    }
})