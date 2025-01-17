const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "remove",
    description: "Remove a song from the queue.",
    category: "Music",
    options: [
        {
            name: "position",
            description: "Position of the song.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
        },
    ],
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
        current: false,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        const track = interaction.options.getNumber("position");

        if (track > player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Song was not found.`);

            return interaction.editReply({ embeds: [embed] });
        }

        await player.queue.remove(track - 1);

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`☑️\` | Song removed!`);

        return interaction.editReply({ embeds: [embed] });
    },
};
