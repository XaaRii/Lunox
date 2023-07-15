const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");

module.exports = {
    name: "search",
    // id: "1055080810992111652",
    description: "Search for your favorite song.",
    category: "Music",
    options: [
        {
            name: "query",
            description: "Provide song name you want to search.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "search_type",
            description: "optional, default: Youtube music",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: "Youtube Music",
                    value: "ytmsearch",
                },
                {
                    name: "Youtube",
                    value: "ytsearch",
                },
                {
                    name: "Spotify",
                    value: "spsearch",
                },
                {
                    name: "SoundCloud",
                    value: "scsearch",
                },
            ],
        },
    ],
    permissions: {
        bot: ["Speak", "Connect"],
        channel: ["Speak", "Connect"],
        user: [],
    },
    settings: {
        optionType: 1,
        inVc: true,
        sameVc: false,
        player: false,
        current: false,
        owner: false,
    },
    run: async (client, interaction, player) => {
        const query = interaction.options.getString("query");

        if (player && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            const warning = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`❌\` | You must be on the same voice channel as mine to use this command.`)
                .setTimestamp();
            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        if (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(query)) {
            const embed = new EmbedBuilder()
                .setDescription(`\`❌\` | Please use \`/play\` command for links.`)
                .setColor(client.color);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        const search = interaction.options.getString("search_type");
        let playSource = search ?? client.config.playSource;

        const res = await client.poru.resolve({ query: query, source: playSource, requester: interaction.user });
        const { tracks } = res;

        const results = tracks.slice(0, 10);

        let n = 0;

        const str = tracks
            .slice(0, 10)
            .map(
                (r) =>
                    `\`${++n}.\` **[${r.info.title.length > 45 ? r.info.title.substr(0, 42) + "..." : r.info.title}](${r.info.uri})** • ${r.info.author}`,
            )
            .join("\n");

        const selectMenuArray = [];

        for (let i = 0; i < results.length; i++) {
            const track = results[i];

            let label = `${i + 1}. ${track.info.title}`;

            if (label.length > 50) label = label.substring(0, 47) + "...";

            selectMenuArray.push({
                label: label,
                description: track.info.author,
                value: i.toString(),
            });
        }

        const selection = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("search")
                .setPlaceholder("Please select your song here")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(selectMenuArray),
        ]);

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Seach Selection Menu", iconURL: interaction.member.displayAvatarURL({}) })
            .setDescription(str)
            .setColor(client.color)
            .setFooter({ text: `You have 30 seconds to make your decision through the dropdown menu.` });

        await interaction.editReply({ embeds: [embed], components: [selection] }).then((message) => {
            let count = 0;

            const selectMenuCollector = message.createMessageComponentCollector({ time: 30000 });
            const toAdd = [];

            try {
                selectMenuCollector.on("collect", async (menu) => {
                    if (menu.user.id !== interaction.member.id) {
                        const notYours = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | This menu is not for you!`);
                        return menu.reply({ embeds: [notYours], ephemeral: true });
                    }

                    menu.deferUpdate();

                    if (!player) {
                        player = await client.poru.createConnection({
                            guildId: interaction.guild.id,
                            voiceChannel: interaction.member.voice.channel.id,
                            textChannel: interaction.channel.id,
                            deaf: true,
                        });
                    }

                    if (player.state !== "CONNECTED") player.connect();

                    for (const value of menu.values) {
                        toAdd.push(tracks[value]);
                        count++;
                    }

                    for (const track of toAdd) {
                        player.queue.add(track);
                    }

                    const track = toAdd.shift();
                    const trackTitle = track.info.title.length > 15 ? track.info.title.substr(0, 15) + "..." : track.info.title;

                    const tplay = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `\`➕\` | **[${trackTitle ? trackTitle : "Unknown"}](${track.info.uri})** • \`${track.info.isStream ? "LIVE" : formatDuration(track.info.length)
                            }\` • ${interaction.user}`,
                        );

                    await message.edit({ embeds: [tplay], components: [] });
                    if (!player.isPlaying && !player.isPaused) return player.play();
                });

                selectMenuCollector.on("end", async (collected) => {
                    if (!collected.size) {
                        const timed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Search timed out.`);
                        return message.edit({ embeds: [timed], components: [] });
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
    },
};
