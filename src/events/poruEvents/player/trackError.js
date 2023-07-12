const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, player, track, error) => {
    if (!player) return;

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    console.log(`Error while loading a song! Track error is in [${player.guildId}]`);
    console.error("trackError:", error, track)

    if (player.queue.length > 0 || player.queue.size !== 0 ) {
        await player.stop();

        const embed = new EmbedBuilder().setDescription(`\`❌\` | Failed to load [${track.info.title}](${track.info.uri}), skipping...`).setColor(client.color);
        return channel.send({ embeds: [embed] });
    } else {
        await player.destroy();

        const embed = new EmbedBuilder().setDescription(`\`❌\` | Failed to load [${track.info.title}](${track.info.uri})! Queue is empty, leaving...`).setColor(client.color);

        return channel.send({ embeds: [embed] });
    }
};
