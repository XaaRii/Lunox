const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { leaveTimeout } = require("../../../settings/config.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, oldState, newState) => {
    const player = client.poru.players.get(newState.guild.id);
    if (!player) return;

    if (!newState.guild.members.cache.get(client.user.id).voice.channelId) player.destroy();

    if (newState.channelId && newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.members.me.voice.suppress) {
        if (
            newState.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect) ||
            (newState.channel?.permissionsFor(newState.guild.members.me).has(PermissionsBitField.Flags.Speak))
        ) {
            newState.guild.members.me.voice.setSuppressed(false);
        }
    }

    if (oldState.id === client.user.id) return;
    if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return;

    let data = await Reconnect.findOne({ guild: newState.guild.id });

    if (!data) data = await Reconnect.findOne({ guild: oldState.guild.id });
    if (data) return;
    // this will make the bot will not be disconnected/destroyed when left alone in voice channel if 247 activated.

    const vcRoom = oldState.guild.members.me.voice.channel.id;
    const leaveEmbedChannel = client.channels.cache.get(player.textChannel);

    if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
        if (
            oldState.guild.members.me.voice?.channel &&
            oldState.guild.members.me.voice.channel.members.filter((m) => !m.user.bot).size === 0
        ) {
            await delay(leaveTimeout);

            const vcMembers = oldState.guild.members.me.voice.channel?.members.size;

            if (!vcMembers || vcMembers === 1) {
                const newPlayer = client.poru.players.get(newState.guild.id);

                newPlayer ? await player.destroy() : oldState.guild.members.me.voice.channel.leave();

                const TimeoutEmbed = new EmbedBuilder()
                    .setDescription(`\`👋\` | Disconnected because I was left alone in <#${vcRoom}>. Cya!`)
                    .setColor(client.color);

                try {
                    if (leaveEmbedChannel) leaveEmbedChannel.send({ embeds: [TimeoutEmbed] });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
};

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
