const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "previous",
    description: "Return to the previous song.",
    category: "Music",
    options: [],
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        if (!player.previousTrack) {
            const embed = new EmbedBuilder().setDescription(`\`❌\` | Couldn't find any previous songs in this queue.`).setColor(client.color);
            return interaction.editReply({ embeds: [embed] });
        }

        await player.queue.unshift(player.previousTrack);
        await player.stop();

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`⏮️\` | Returned to \`previous\` song.`);
        return interaction.editReply({ embeds: [embed] });
    },
};
