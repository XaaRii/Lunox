const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "replay",
    description: "Replay the current song.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        optionType: 2,
        inVc: true,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        if (!player.currentTrack.info.isSeekable) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Song can't be replayed.`);
            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.seekTo(0);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`⏪\` | Song has been \`replayed\`.`);
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
