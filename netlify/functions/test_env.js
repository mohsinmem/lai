exports.handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            url: process.env.SUPABASE_URL || 'NONE',
            key: process.env.SUPABASE_KEY ? 'EXISTS' : 'NONE',
            service_key: process.env.SUPABASE_SERVICE_KEY ? 'EXISTS' : 'NONE'
        })
    };
};
