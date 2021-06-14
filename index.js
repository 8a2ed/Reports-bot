const discord = require('discord.js');
const client = new discord.Client();
///
const ms = require('ms');
const db = require('quick.db')
///
const prefix = ''; // PREFIX
client.login(''); // TOKEN
///
client.on('ready', () => {
    client.user.setStatus('idle');
    console.log('Working ..!');
});
///
const reports = require('./modules/reports.js');
const { promptMessage } = require("./functions.js");
///
client.on('message', async message => {
    if (!message.channel || message.channel.type === 'dm') return;
    if (message.content.startsWith(prefix + 'report')) {
        const men = message.mentions.members.first();
        if (!men) return message.channel.send('Mention the valid user.');
        const dlel = message.content.split(' ').slice(2).join(' ');
        if (!dlel) return message.channel.send(`Enter an \`Image\`.`);
        var dlel2 = message.content.split(' ').slice(3).join(' ');
        var dlel3 = message.content.split(' ').slice(4).join(' ');
        if (!dlel2) dlel2 = "";
        if (!dlel3) dlel3 = "";
        var msg = await message.channel.send(`Are you sure you wanna to report?`).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();
                db.set(`reporter_${message.guild.id}_${message.author.id}`, message.author.id);
                db.set(`user_${message.guild.id}`, men.id);
                db.set(`dlel_${message.guild.id}`, dlel);
                db.set(`dlel2_${message.guild.id}`, dlel2);
                db.set(`dlel3_${message.guild.id}`, dlel3)
                const ch = msg.guild.channels.cache.get('848662777387024446');
                if(!ch) return
                const embed = new discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png' }))
                .addField(`Reporter`, `${message.author} | ${message.author.id}`, true)
                .addField(`User`, `${men}`, true)
                .addField(`Images`, `[#1 Image](${dlel}) | [#2 Image](${dlel2}) | [#3 Image](${dlel3})`)
                .setTimestamp()
                ch.send(embed)
                await message.channel.send(`Your report has been saved and sent to reports channel !`)
                    .catch(err => {
                        if (err) return message.channel.send(`Error: ${err}`)
                    });

            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Canceled.`)
                    .then(m => m.delete(10000));
            }
        });
    }
});
///
client.on('message', message => {
  if(!message.channel || message.channel.type === 'dm');
  if(message.content.startsWith(prefix + 'check')) {
    const member = message.content.split(' ').slice(1).join(' ') || message.mentions.users.first();
    if(!member) return message.channel.send(`Mention user or type id`);
    const ch = db.get(`reporter_${message.guild.id}_${member}`, member);
    if(ch !== null) {
      const embed = new discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png' }))
      .addField(`Reporter`, `<@!${db.get(`reporter_${message.guild.id}_${member}`, member)}> | ${db.get(`reporter_${message.guild.id}_${member}`, member)}`)
      .addField(`User`, `<@!${db.get(`user_${message.guild.id}`)}>`)
      .addField(`Images`, `[#1 Image](${db.get(`dlel_${message.guild.id}`)}) | [#2 Image](${db.get(`dlel2_${message.guild.id}`)}) | [#3 Image](${db.get(`dlel3_${message.guild.id}`)})`)
      message.channel.send(embed)
    }
  }
})
