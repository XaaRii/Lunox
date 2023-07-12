const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "loop",
    description: "Set loop mode to current song.",
    category: "Music",
    options: [
        {
            name: "mode",
            description: "Choose loop mode for current player.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "current",
                    value: "current",
                },
                {
                    name: "queue",
                    value: "queue",
                },
                {
                    name: "none",
                    value: "none",
                },
            ],
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
        
        const input = interaction.options.getString("mode");
        const embed = new EmbedBuilder().setColor(client.color);
        switch (input) {
            case "current":
                await player.setLoop("TRACK");
                embed.setDescription(`\`🔂\` | Loop mode set to \`current\``);
                break;
            case "queue":
                await player.setLoop("QUEUE");
                embed.setDescription(`\`♾️\` | Loop mode set to \`queue\``);
                break;
            case "none":
                await player.setLoop("NONE");
                embed.setDescription(`\`🔁\` | Loop mode set to \`none\``);
                break;
        }
        return interaction.editReply({ embeds: [embed] });
    },
};
