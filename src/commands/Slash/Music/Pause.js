const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pause",
    description: "Pause current song.",
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
        const embed = new EmbedBuilder().setColor(client.color);
        if (!player.isPaused) {
            await player.pause(true);
            embed.setDescription(`\`⏸️\` | Song has been \`paused\``);
            return interaction.editReply({ embeds: [embed] });
        } else {
            embed.setDescription(`\`❌\` | Song was already \`paused\`.\n Did you perhaps meant to \`/resume\`?`);
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
