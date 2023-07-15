const { ActivityType } = require("discord.js");

module.exports.run = async (client) => {
    await client.poru.init(client, {
        shards: client.cluster.info.TOTAL_SHARDS,
        clientName: client.user.username,
        clientId: client.user.id,
    });

    if (client.config.module === "standalone") {
        setInterval(async () => {
                const promises = [
                client.cluster.broadcastEval("this.guilds.cache.size"),
                client.cluster.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
            ];

            const results = await Promise.all(promises);

            const servers = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const members = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

            const status = [
                { type: ActivityType.Listening, name: "your music" },
                { type: ActivityType.Listening, name: "your requests" },
                { type: ActivityType.Listening, name: "/play <link>" },
                { type: ActivityType.Listening, name: `${members} users` },
                { type: ActivityType.Competing, name: `${servers} servers` },
            ];
        
            const index = Math.floor(Math.random() * status.length);
        
            await client.user.setActivity(status[index].name, { type: status[index].type });
        }, 600000);
    }

    console.log(`[INFO] ${client.user.username} is ready in ${client.guilds.cache.size} servers`);
};
