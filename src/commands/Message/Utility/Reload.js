const { readdirSync } = require("node:fs");

module.exports = {
    name: 'reload',
	description: 'Reloads a command',
    category: "Utility",
	aliases: ['rl'],
    owner: true,
    run: (client, message, args) => {
        if (!args.length) return message.reply("I don't know what command you wanna reload!");
		const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.channel.send(`That's not a command I would know of, pal!`);
		
        readdirSync("./src/commands/Message/").forEach((dir) => {
            const cmds = readdirSync(`./src/commands/Message/${dir}/`).filter((file) => file.endsWith(".js"));
    
            for (const file of cmds) {
                if (file.toLowerCase() === command.name + ".js") {
                    delete require.cache[require.resolve(`../${dir}/${file}`)];
                    try {
                        const newCommand = require(`../${dir}/${file}`);
                        client.commands.set(newCommand.name, newCommand);
                    } catch (error) {
                        console.log(error);
                        message.channel.send(`I've got an error while reloading that command:\n\`${error.message}\``);
                    }
                    return message.channel.send(`Command \`${command.name}\` reloaded successfully`);
                    
                }
                continue;
            }
        });
    },
};
