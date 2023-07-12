module.exports.run = async (client) => {
    await client.poru.init(client, {
        shards: client.cluster.info.TOTAL_SHARDS,
        clientName: client.user.username,
        clientId: client.user.id,
    });

    console.log(`[INFO] ${client.user.username} is ready with ${client.guilds.cache.size} server`);
};
