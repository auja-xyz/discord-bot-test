require('dotenv').config();
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const botToken = process.env.BOT_TOKEN;

const welcomeChannelId = '907980448406335568';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction: any) => {
  console.log('interaction', interaction);
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on("messageCreate", async (msg: any) => {
  //console.log(msg);
  console.log('user', msg.author.username, 'msg', msg.content);
  if (msg.content === "ping") {
    msg.reply("pong");
  } else if (msg.content === "test") {
    client.channels.cache.get(welcomeChannelId).send(`Welcome ${msg.author.username} like this message to open a ticket to join the server...`).then((message: any) => {
      const filter = (reaction: any, user: any) => {
        console.log('reaction', reaction);
        console.log('user', user);
        //return user.id === msg.author.id;
        return true;
      };
      message.react('👍');
      message.react('👎');
      message.awaitReactions({ max: 1, time: 10000 })
	            .then((collected: any) => {
                console.log('collected', collected);
		            const reaction = collected.first();

                if (reaction.emoji.name === '👍') {
                  message.reply('You reacted with a thumbs up.');
                } else {
                  message.reply('You reacted with a thumbs down.');
                }
              })
              .catch((collected: any) => {
                message.reply('You reacted with neither a thumbs up, nor a thumbs down.');
                setTimeout(() => message.delete().then(() => console.log('message deleted')), 5000);
              });
    });
  }
});

//client.on("debug", function(info: any){
//  console.log(`debug -> ${info}`);
//});


client.on("typingStart", function(channel: any, user: any){
  console.log(`${user.tag} has started typing`);
});

client.on("typingStop", function(channel: any, user: any){
  console.log(`${user.tag} has stopped typing`);
});


if (botToken) {
  client.login(botToken);
} else {
  console.log("Missing BOT_TOKEN from .env!");
}