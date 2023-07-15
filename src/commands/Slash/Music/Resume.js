const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "resume",
    description: "Resume paused song.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        optionType: 1,
        inVc: true,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        if (player.isPaused) {
            await player.pause(false);
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`▶️\` | Song has been \`resumed\`.`);
            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Song was not \`paused\`.`);
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
