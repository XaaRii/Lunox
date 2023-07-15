const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "lyrics",
    description: "Display lyrics for current song.",
    category: "Music",
    options: [
        {
            name: "search",
            description: "Search lyric for specific song.",
            type: ApplicationCommandOptionType.String,
            required: false,
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
        current: true,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply();

        const value = interaction.options.getString("search");

        let song = value;

        const CurrentSong = player.currentTrack.info;
        const titles = CurrentSong.title.replace("(Official Video)", "").replace("(Official Audio)", "");
        const authors = CurrentSong.author.replace("- Topic", "");

        if (!song && CurrentSong) song = `${titles} ${authors}`;

        try {
            await fetch(`https://some-random-api.com/others/lyrics?title=${song}`)
                .then((res) => res.json())
                .then((data) => {
                    const lyricSong = data.lyrics;
                    const titleSong = data.title;
                    const authorSong = data.author;

                    const gSearch = { query: `${titleSong} by ${authorSong} lyrics` };
                    const gLink = client.gsearch.craft(gSearch).url;
                    const urlSong = gLink.replace("http", "https");

                    if (!lyricSong) {
                        const lyricError = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Lyrics was not found.\n[Try searching for it yourself](${urlSong})`);
                        return interaction.editReply({ embeds: [lyricError] });
                    }

                    const lyrics = lyricSong.length > 3905 ? lyricSong.substr(0, 3900) + "....." : lyricSong;

                    const lyricEmbed = new EmbedBuilder()
                        .setAuthor({
                            name: `${titleSong} by ${authorSong} lyrics`,
                            iconURL: client.user.displayAvatarURL({ dynamic: true }),
                        })
                        .setColor(client.color)
                        .setDescription(`${lyrics}\n**[Check it on google](${urlSong})**`)
                        .setThumbnail(data.thumbnail.genius)
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                        });

                    return interaction.editReply({ embeds: [lyricEmbed] });
                });
        } catch (err) {
            console.log(err);

            const lyricError = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Lyrics was not found.`);

            return interaction.editReply({ embeds: [lyricError] });
        }
    },
};
