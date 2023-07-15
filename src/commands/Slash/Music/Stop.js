const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports = {
    name: "stop",
    description: "Stops or disconnects me.",
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

        // disable 24/7
        let data = await Reconnect.findOne({ guild: interaction.guild.id });
        await data?.delete();

        await player.message?.delete().catch(e => null);

        await player.destroy();

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`👋\` | Alright, cya!`);
        return interaction.editReply({ embeds: [embed] });
    },
};
