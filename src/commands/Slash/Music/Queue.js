const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const lodash = require("lodash");
const formatDuration = require("../../../structures/FormatDuration.js");

module.exports = {
    name: "queue",
    description: "Show current queue.",
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

        const emoji = client.emoji.queue;
        const npSong = player.currentTrack.info;
        const currentDuration = formatDuration(npSong.length);
        const currentTitle = npSong.title.length > 60 ? npSong.title.substr(0, 60) + "..." : npSong.title;
        const npDuration = npSong.isStream ? "LIVE" : currentDuration;
        const npTitle = npSong.title ? currentTitle : "Unknown";

        const queue = player.queue.map(
            (track, index) =>
                `**${index + 1}. [${
                    track.info.title
                        ? track.info.title.length > 45
                            ? track.info.title.substr(0, 42) + "..."
                            : track.info.title
                        : "Unknown"
                }](${track.info.uri})** • \`${track.info.isStream ? "LIVE" : formatDuration(track.info.length)}\` • ${
                    track.info.requester
                }`,
        );

        const pages = lodash.chunk(queue, 20).map((x) => x.join("\n"));

        let page = 0;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Queue List`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor(client.color)
            .setThumbnail(npSong.image)
            .setDescription(
                `**__Now Playing__**\n**[${npTitle}](${npSong.uri})** • \`${npDuration}\` • ${npSong.requester}\n\n**__Up Next__**\n${
                    pages[page] ? pages[page] : "Queue is empty"
                }`,
            )
            .setFooter({
                text: `Total Queued • ${player.queue.length} tracks`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        const back = new ButtonBuilder().setCustomId("back").setEmoji(emoji.back).setStyle(ButtonStyle.Secondary);
        const cancel = new ButtonBuilder().setCustomId("cancel").setEmoji(emoji.cancel).setStyle(ButtonStyle.Danger);
        const next = new ButtonBuilder().setCustomId("next").setEmoji(emoji.next).setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(back, cancel, next);

        if (pages.length <= 1) {
            return interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply({ embeds: [embed], components: [row] }).then((msg) => {
                const collector = msg.createMessageComponentCollector({ time: 120000 });

                collector.on("collect", async (message) => {
                    if (message.customId === "back") {
                        message.deferUpdate();

                        page = page - 1 < 0 ? pages.length - 1 : --page;

                        embed.setDescription(
                            `**__Now Playing__**\n**[${npTitle}](${npSong.uri})** • \`${npDuration}\` • ${npSong.requester}\n\n**__Up Next__**\n${pages[page]}`,
                        );

                        return msg.edit({ embeds: [embed], components: [row] });
                    } else if (message.customId === "cancel") {
                        message.deferUpdate();

                        await msg.edit({ embeds: [embed], components: [] });

                        return collector.stop();
                    } else if (message.customId === "next") {
                        message.deferUpdate();

                        page = page + 1 >= pages.length ? 0 : ++page;

                        embed.setDescription(
                            `**__Now Playing__**\n**[${npTitle}](${npSong.uri})** • \`${npDuration}\` • ${npSong.requester}\n\n**__Up Next__**\n${pages[page]}`,
                        );

                        return msg.edit({ embeds: [embed], components: [row] });
                    }
                });

                collector.on("end", async (collected, reason) => {
                    if (reason === "time" || !collected.size) {
                        return msg.edit({ embeds: [embed], components: [] });
                    }
                });
            });
        }
    },
};
