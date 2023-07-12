const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports = {
    name: "247",
    description: "Toggle enable 24/7 in voice channel.",
    category: "Utility",
    permissions: {
        bot: ["Speak", "Connect"],
        channel: ["Speak", "Connect"],
        user: ["Administrator"],
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

        let data = await Reconnect.findOne({ guild: interaction.guild.id });
        if (data) {
            await data.delete();

            const off = new EmbedBuilder().setDescription(`\`🔴\` | 24/7 Mode has been \`disabled\``).setColor(client.color);
            return interaction.editReply({ embeds: [off] });
        } else if (!data) {
            const newData = await Reconnect.create({
                guild: player.guildId,
                text: player.textChannel,
                voice: player.voiceChannel,
            });

            await newData.save();

            const on = new EmbedBuilder().setDescription(`\`🔵\` | 24/7 Mode has been \`enabled\``).setColor(client.color);
            return interaction.editReply({ embeds: [on] });
        }
    },
};
