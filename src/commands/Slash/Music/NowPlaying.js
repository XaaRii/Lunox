const { EmbedBuilder } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");

module.exports = {
    name: "nowplaying",
    description: "Show what is currently playing.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        optionType: 1,
        inVc: false,
        sameVc: false,
        player: true,
        current: true,
        owner: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        if (!player.currentTrack) return;

        try {
            const Titles =
                player.currentTrack.info.title.length > 200
                    ? player.currentTrack.info.title.substr(0, 200) + "..."
                    : player.currentTrack.info.title;
            const Author =
                player.currentTrack.info.author.length > 60
                    ? player.currentTrack.info.author.substr(0, 60) + "..."
                    : player.currentTrack.info.author;
            const currentPosition = formatDuration(player.position);
            const trackDuration = formatDuration(player.currentTrack.info.length);
            const playerDuration = player.currentTrack.info.isStream ? "LIVE" : trackDuration;
            const currentAuthor = player.currentTrack.info.author ? Author : "Unknown";
            const currentTitle = player.currentTrack.info.title ? Titles : "Unknown";
            const Part = Math.floor((player.position / player.currentTrack.info.length) * 30);
            const Emoji = player.isPlaying ? "🕒 |" : "⏸ |";

            let sources = "Unknown";
            switch (player.currentTrack.info.sourceName) {
                case "youtube":
                    sources = "YouTube";
                    break;
                case "soundcloud":
                    sources = "SoundCloud";
                    break;
                case "spotify":
                    sources = "Spotify";
                    break;
                case "applemusic":
                    sources = "Apple Music";
                    break;
                case "bandcamp":
                    sources = "Bandcamp";
                    break;
                case "http":
                    sources = "HTTP";
                    break;
            }

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: player.isPlaying ? `Now Playing` : `Song Paused`,
                    iconURL: "https://cdn.discordapp.com/attachments/1014342568554811443/1025740239236517908/music-disc.gif",
                })
                .setThumbnail(player.currentTrack.info.image)
                .setDescription(`**[${currentTitle}](${player.currentTrack.info.uri})**`)
                .addFields([
                    { name: `Author:`, value: `${currentAuthor}`, inline: true },
                    { name: `Requested By:`, value: `${player.currentTrack.info.requester}`, inline: true },
                    { name: `Source:`, value: `${sources}`, inline: true },
                    { name: `Duration:`, value: `${playerDuration}`, inline: true },
                    { name: `Volume:`, value: `${player.volume}%`, inline: true },
                    { name: `Queue Left:`, value: `${player.queue.length}`, inline: true },
                    {
                        name: `Song Progress: \`[${currentPosition}]\``,
                        value: `\`\`\`${Emoji} ${"─".repeat(Part) + "🔵" + "─".repeat(30 - Part)}\`\`\``,
                        inline: false,
                    },
                ])
                .setColor(client.color)
                .setFooter({ text: `© ${client.user.username}` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            return interaction.editReply({ content: `\`❌\` | Nothing is playing!` });
        }
    },
};
