const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");

module.exports = {
    name: "skip",
    description: "Skip current song.",
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
        await player.stop();

        if (!player || player.queue.size == 0) {
            const embed = new EmbedBuilder().setDescription(`\`⏭️\` | Song skipped, no more songs in queue.`).setColor(client.color);
            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`⏭️\` | Song skipped!`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
