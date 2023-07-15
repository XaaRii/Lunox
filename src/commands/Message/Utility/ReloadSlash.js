const { readdirSync } = require("node:fs");

module.exports = {
	name: 'reloadslash',
	description: 'Reloads a slash command',
    category: "Utility",
	aliases: ['rls'],
    owner: true,
    run: (client, message, args) => {
        if (!args.length) return message.reply("I don't know what command you wanna reload!");
		const commandName = args[0].toLowerCase();
		const command = client.slashCommands.get(commandName);
		if (!command) return message.channel.send(`That's not a command I would know of, pal!`);
		
        readdirSync("./src/commands/Slash/").forEach((dir) => {
            const cmds = readdirSync(`./src/commands/Slash/${dir}/`).filter((file) => file.endsWith(".js"));
    
            for (const file of cmds) {
                if (file.toLowerCase() === command.name + ".js") {
                    delete require.cache[require.resolve(`../../Slash/${dir}/${file}`)];
                    try {
                        const newCommand = require(`../../Slash/${dir}/${file}`);
                        client.slashCommands.set(newCommand.name, newCommand);
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
