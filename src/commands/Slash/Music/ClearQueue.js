const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "clearqueue",
    description: "Clear the current queue.",
    category: "Music",
    options: [],
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: true,
        player: true,
        current: false,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        if (!player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Queue was already empty.`);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const { length } = player.queue;

            await player.queue.clear();

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`☑️\` | \`${length}\` songs were removed from queue.`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
