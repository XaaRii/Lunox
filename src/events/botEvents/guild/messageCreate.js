module.exports.run = async (client, message) => {
    //Ignoring bot, system, dm and webhook messages
    if (message.author.bot || !message.guild || message.system || message.webhookId) return;

    let prefix = client.prefix;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);

    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;

    //grab command or ignore
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (!command) return;

    if (client.dev.has(true) && message.author.id !== client.owner) {
        return message.reply({
            content: `\`❌\` | ${client.config.module === "standalone" ? client.user : client.config.module.split("#")[1]} is under maintenance. Sorry for the inconvenience.\n\nThank You.`,
        });
    }

    console.log(`[PREFIX] ${command.name} used by ${message.author.tag} from ${message.guild.name} (${message.guild.id})`);

    //Default Permission
    const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const botMissingPermissions = [];

    for (const perm of botPermissions) {
        if (!message.channel.permissionsFor(message.guild.members.me).has(perm)) {
            botMissingPermissions.push(perm);
        }
    }

    if (botMissingPermissions.length > 0)
        return message.reply({
            content: `\`❌\` | I need at least these permissions: \`ViewChannel\`, \`SendMessages\`, \`EmbedLinks\`.\nIt seems I'm missing these: [\`${botMissingPermissions.join("\`, \`")}\`]\nPlease double check them in your server role & channel settings.`,
        });

    //Check Owner
    if (command.owner && message.author.id !== client.owner) {
        return message.reply({ content: `\`❌\` | I ain't gonna listen to someone who can't even write a 'Hello world' program!` });
    }

    //Error handling
    try {
        command.run(client, message, args);
    } catch (error) {
        console.log(error);

        return message.reply({ content: `\`❌\` | Something went wrong.` });
    }
};
