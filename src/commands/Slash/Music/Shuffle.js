const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "shuffle",
    description: "Shuffle current queue.",
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
        current: false,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        if (!player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Queue is empty, nothing to shuffle.`);
            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.queue.shuffle();
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`🔀\` | Queue has been \`shuffled\`.`);
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
