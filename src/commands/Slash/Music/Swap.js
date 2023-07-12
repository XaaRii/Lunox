const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "swap",
    description: "Swaps positions of two songs.",
    category: "Music",
    options: [
        {
            name: "first",
            description: "First song you want to swap",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
        },
        {
            name: "second",
            description: "Second song you want to swap",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 2,
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
        current: false,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        const first = interaction.options.getNumber("first");
        const second = interaction.options.getNumber("second");

        if (first === second || isNaN(first) || first < 1 || first > player.queue.length || isNaN(second) || second < 1 || second > player.queue.length)
            return interaction.editReply(`\`❌\` | Such swap is not possible.`);

        [player.queue[first - 1], player.queue[second - 1]] = [player.queue[second - 1], player.queue[first - 1]];

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`☑️\` | Swapped \`${player.queue[second - 1].info.title}\` with \`${player.queue[first - 1].info.title}\`.`);

        return interaction.editReply({ embeds: [embed] });
    },
};
