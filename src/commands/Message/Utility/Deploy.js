const { SlashCommandBuilder, ApplicationCommandOptionType } = require("discord.js");
const { readdirSync } = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "deploy",
    description: "deploy commands, owner-only",
    category: "Utility",
    aliases: [],
    owner: true,
    run: async (client, message) => {
        // for now, non-merged commands
        // i don't have enough time for this yet

        const data = [];
        readdirSync("./src/commands/Slash/").forEach(async (dir) => {
            const commands = readdirSync(`./src/commands/Slash/${dir}/`).filter((file) => file.endsWith(".js"));
            if (["Music", "Utility"].includes(dir)) {
                
                    for (let i = 0; i < commands.length; i++) {
                        const file = commands[i];
                        const pull = await require(path.join(__dirname, `../../Slash/${dir}/${file}`));
                        data.push(pull);
                        console.log(pull)
                    }
                
                    await client.application.commands.fetch();
                    const existing = client.application.commands.cache;
                    const all = [...existing.values(), ...data];
                    console.log(all)
                    await client.application.commands.set(all);
                    message.reply(`commands loaded!`);
            }

        });

        /*
        // flawed idea:
        const data = [];
        const command = new SlashCommandBuilder()
            .setName('music1')
            .setDescription('Music commands');
        const command2 = new SlashCommandBuilder()
            .setName('music2')
            .setDescription('Music commands');

        const optionTypeToMethod = {
            [ApplicationCommandOptionType.String]: 'addStringOption',
            [ApplicationCommandOptionType.Integer]: 'addIntegerOption',
            [ApplicationCommandOptionType.Boolean]: 'addBooleanOption',
            [ApplicationCommandOptionType.User]: 'addUserOption',
            [ApplicationCommandOptionType.Channel]: 'addChannelOption',
            [ApplicationCommandOptionType.Role]: 'addRoleOption',
            [ApplicationCommandOptionType.Mentionable]: 'addMentionableOption',
            [ApplicationCommandOptionType.Number]: 'addNumberOption',
        };

        readdirSync("./src/commands/Slash/").forEach((dir) => {
            const commands = readdirSync(`./src/commands/Slash/${dir}/`).filter((file) => file.endsWith(".js"));
        
            for (const file of commands) {
                const pull = require(path.join(__dirname, `../../Slash/${dir}/${file}`));
            
                if (pull.name) {
                    if (client.config.module !== "standalone") {
                        if (["Music", "Utility"].includes(dir)) {
                            console.log(pull.name)
                            switch (pull.settings.optionType) {
                                case 1:
                                    const subcommand = command.addSubcommand(subcommand =>
                                        subcommand
                                            .setName(pull.name)
                                            .setDescription(pull.description)
                                    );
                                    if (!pull.options) continue;
                                    for (const option of pull.options) {
                                        if (!option.name || !option.description) {
                                            console.error(`Option name is undefined for option: ${JSON.stringify(option)}`);
                                            continue;
                                        }
                                        const method = optionTypeToMethod[option.type];
                                        subcommand[method](option => option.setName(option.name).setDescription(option.description));
                                    }
                                    break;
                                case 2:
                                    const subcommand2 = command2.addSubcommand(subcommand =>
                                        subcommand
                                            .setName(pull.name)
                                            .setDescription(pull.description)
                                    );
                                    if (!pull.options) continue;
                                    for (const option of pull.options) {
                                        if (!option.name || !option.description) {
                                            console.error(`Option name is undefined for option: ${JSON.stringify(option)}`);
                                            continue;
                                        }
                                        const method = optionTypeToMethod[option.type];
                                        subcommand2[method](option => option.setName(option.name).setDescription(option.description));
                                    }
                                    break;
                            }
                        
                            // 1
                            // loop 3
                            // np
                            // pause 
                            // play 2
                            // playtop 2
                            // queue 
                            // remove 1
                            // resume
                            // search 2
                            // shuffle
                            // skip
                            // stop
                            // -21
                            // 
                            // 2
                            // AP 0
                            // CQ 0
                            // Eff 7
                            // Join 0
                            // lyr 1
                            // previous 0
                            // skipto 1
                            // swap 2
                            // volume 1
                            // replay 0
                            // seek 1
                            // -23?
                        
                        } else console.info("Skipping", file, "because we are not running standalone.");
                    } else {
                        data.push(pull);
                    }
                } else {
                    console.info("Skipping malformed command", file);
                    continue;
                }
            }
        });
        if (client.config.module === "standalone") {
            await client.application.commands.set(data);
            message.reply(`Standalone commands loaded!`);
        } else {
            await client.application.commands.fetch();
            const existing = client.application.commands.cache;
            const all = [...existing.values(), command.toJSON(), command2.toJSON()];
            await client.application.commands.set(all);
            message.reply(`Music commands with ${command.options.length + command2.options.length} subcommands loaded!`);
        }
        console.log(`[${client.config.module}] commands deployed!`);
        */
    },
};
