const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "volume",
    description: "Set the volume of the current player.",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "The number of volume which you want to set.",
            type: ApplicationCommandOptionType.Number,
            required: false,
            min_value: 1,
            max_value: 100,
        },
    ],
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
        current: false,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        const value = interaction.options.getNumber("amount");

        if (!value) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`🔊\` | Current player volume: \`${player.volume}%\``);
            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.setVolume(value);
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`🔊\` | Volume has been set to: \`${value}%\``);
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
