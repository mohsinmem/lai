exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
    })
  };
};
