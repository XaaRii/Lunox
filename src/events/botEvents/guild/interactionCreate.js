const { EmbedBuilder, InteractionType } = require("discord.js");
const Ban = require("../../../settings/models/Ban.js");

module.exports.run = async (client, interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    await client.createInteraction(interaction);

    if (client.dev.has(true) && interaction.user.id !== client.owner) {
        return interaction.reply({
            content: `\`❌\` | ${client.config.module === "standalone" ? client.user : client.config.module.split("#")[1]} is under maintenance. Sorry for the inconvenience.\n\nThank You.`,
            ephemeral: true,
        });
    }

    console.log(`[SLASH] ${command.name} used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`);

    const userBan = await Ban.findOne({ userID: interaction.user.id });

    if (userBan && userBan.isBanned === true && interaction.user.id !== client.owner) {
        return interaction.reply({
            content: `\`❌\` | You are banned from using ${client.user}. If you think this is a mistake, contact my owner Pawele.`,
            ephemeral: true,
        });
    }

    //Default Permission
    const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const botMissingPermissions = [];

    for (const perm of botPermissions) {
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(perm)) {
            botMissingPermissions.push(perm);
        }
    }

    if (botMissingPermissions.length > 0) {
        return interaction.reply({
            content: `\`❌\` | I need at least these permissions: \`ViewChannel\`, \`SendMessages\`, \`EmbedLinks\`.\nIt seems I'm missing these: [\`${botMissingPermissions.join("\`, \`")}\`]\nPlease double check them in your server role & channel settings.`,
            ephemeral: true,
        });
    }

    const warning = new EmbedBuilder().setColor(client.color);

    //Check Bot Command Permissions
    if (!interaction.guild.members.cache.get(client.user.id).permissions.has(command.permissions.bot || [])) {
        warning.setDescription(`\`❌\` | I don't have permission \`${command.permissions.bot.join(", ")}\` to execute this command.`);
        return interaction.reply({ embeds: [warning], ephemeral: true });
    }

    //Check User Permissions
    if (!interaction.member.permissions.has(command.permissions.user || [])) {
        warning.setDescription(`\`❌\` | You don't have permission \`${command.permissions.user.join(", ")}\` to execute this command.`,);
        return interaction.reply({ embeds: [warning], ephemeral: true });
    }

    // Check Player
    let player = client.poru.players.get(interaction.guild.id);
    if (command.settings.player && !player) {
        warning.setDescription(`\`❌\` | I don't have anything to play *yet*.`);
        return interaction.reply({ embeds: [warning], ephemeral: true });
    }

    //Currently Playing Check
    if (command.settings.current && !player.currentTrack) {
        warning.setDescription(`\`❌\` | Nothing is currently playing.`);
        return interaction.reply({ embeds: [warning], ephemeral: true });
    }

    // Check In Voice & Same Voice Channel
    const { channel } = interaction.member.voice;
    //In Voice Channel Check
    if (command.settings.inVc) {
        if (!channel) {
            warning.setDescription(`\`❌\` | You must be in a voice channel to use this command.`);
            return interaction.reply({ embeds: [warning], ephemeral: true });
        }
    }

    //Same Voice Channel Check
    if (command.settings.sameVc) {
        if (!channel || interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            warning.setDescription(`\`❌\` | You must be in the same voice channel as me to use this command.`);
            return interaction.reply({ embeds: [warning], ephemeral: true });
        }
    }
    //Check Channel Permissions
    if ((command.settings.inVc || command.settings.sameVc) &&
        !interaction.guild.members.cache
            .get(client.user.id)
            .permissionsIn(channel)
            .has(command.permissions.channel || [])
    ) {
        warning.setDescription(`\`❌\` | I don't have permission \`${command.permissions.channel.join(", ")}\` to execute this command in this VC.`,);
        return interaction.reply({ embeds: [warning], ephemeral: true });
    }

    //Check Owner
    if (command.settings.owner && interaction.user.id !== client.owner) {
        warning.setDescription(`\`❌\` | Only my owner can use this command!`);
        return interaction.reply({ embeds: [warning], ephemeral: true });
    }

    //Error handling
    try {
        command.run(client, interaction, player);
    } catch (error) {
        console.log(error);
        warning.setDescription(`\`❌\` | Something went wrong.`);
        return interaction.editReply({ embeds: [warning], ephmeral: true });
    }
};
