const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");

module.exports = {
    name: "playtop",
    description: "Play your favorite song/s right after the current one.",
    category: "Music",
    options: [
        {
            name: "query",
            description: "Provide song name/url.",
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
        inVc: true,
        sameVc: false,
        player: false,
        current: false,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();
        const song = interaction.options.getString("query");
        const search = interaction.options.getString("search_type");

        if (player && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`❌\` | You must be in the same voice channel as me to use this command.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        let playSource = search ?? client.config.playSource;

        const res = await client.poru.resolve({ query: song, source: playSource, requester: interaction.user });
        const { loadType, tracks, playlistInfo } = res;

        if (loadType === "LOAD_FAILED" || loadType === "NO_MATCHES") {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Song was not found or it failed to load!`);
            return interaction.editReply({ embeds: [embed] });
        }

        await interaction.deferReply({ ephemeral: false });

        if (!player) {
            player = await client.poru.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                deaf: true,
            });
        }

        if (player.state !== "CONNECTED") player.connect();

        if (loadType === "PLAYLIST_LOADED") {
            for (let i = tracks.length - 1; i >= 0; i--) {
                player.queue.unshift(tracks[i]);
            }

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`☑️\` | **[${playlistInfo.name}](${song})** • \`${tracks.length}\` tracks • ${interaction.user}`);

            await interaction.editReply({ embeds: [embed] });
            if (!player.isPlaying && !player.isPaused) return player.play();
        } else if (loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED") {
            const track = tracks[0];

            player.queue.unshift(track);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                    `\`☑️\` | **[${track.info.title ? track.info.title : "Unknown"}](${track.info.uri})** • \`${
                        track.info.isStream ? "LIVE" : formatDuration(track.info.length)
                    }\` • ${interaction.user}`,
                );

            await interaction.editReply({ embeds: [embed] });
            if (!player.isPlaying && !player.isPaused) return player.play();
        }
    },
};
