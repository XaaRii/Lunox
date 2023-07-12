const { SlashCommandBuilder } = require("discord.js");
const { readdirSync } = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "deploy",
    description: "deploy commands, owner-only",
    category: "Utility",
    aliases: [],
    owner: true,
    run: async (client, message) => {
        module.exports = async (client) => {
            const data = [];
            const command = new SlashCommandBuilder()
                .setName('music')
                .setDescription('Music commands');

            readdirSync("./src/commands/Slash/").forEach((dir) => {
                const commands = readdirSync(`./src/commands/Slash/${dir}/`).filter((file) => file.endsWith(".js"));

                for (const file of commands) {
                    const pull = require(path.join(__dirname, `../commands/Slash/${dir}/${file}`));

                    if (pull.name) {
                        if (client.config.module !== "standalone") {
                            !["Music", "Utility"].includes(dir) ?
                            console.info("Skipping", file, "because we are not running standalone.") :
                            command.addSubcommand(subcommand => subcommand
                                .setName(pull.name)
                                .setDescription(pull.description)
                                .addOptions(...pull.options)
                                );
                            } else {
                                data.push(pull);
                            }
                    } else {
                        console.info("Skipping malformed command", file);
                        continue;
                    }
                }
            });
            if (client.config.module !== "standalone") {
                await client.application.commands.set(data);
                message.reply(`Standalone commands loaded!`);
            } else {
                await client.application.commands.fetch();
                const existing = client.application.commands.cache;
                const all = [...existing.values(), command.toJSON()];
                await client.application.commands.set(all);
                message.reply(`Music command with ${command.options.length} subcommands loaded!`);
            }
            console.log(`[${client.config.module}] commands deployed!`);
        }
    },
};
