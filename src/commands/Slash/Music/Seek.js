const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");

module.exports = {
    name: "seek",
    description: "Jump to specified time in the current song.",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "New position in the song.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 0,
        },
    ],
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

        const position = interaction.options.getNumber("seconds", true);
        const Duration = formatDuration(position * 1000);

        if (!player.currentTrack.info.isSeekable) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Song is not seekable.`);
            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.seekTo(position * 1000).catch(err => {
                const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | I'm sorry, I wasn't able to seek to that time.`);
                return interaction.editReply({ embeds: [embed] });
            });

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`⏩\` | Song seeked to: \`${Duration}\``);
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
