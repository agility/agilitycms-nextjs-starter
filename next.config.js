const agility = require("@agility/content-fetch");

const api = agility.getApi({
  guid: process.env.AGILITY_GUID,
  apiKey: process.env.AGILITY_API_FETCH_KEY,
});

const getRedirects = async () => {
  try {
    return (redirects = await api.getUrlRedirections({}));
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  async redirects() {
    const { items } = await getRedirects();

    console.log(items)

    const redirects = items.map((redirect) => {
      let permanent;

      const source = redirect.originUrl.replace("~", "");
      const destination = redirect.destinationUrl.replace("~", "");

      if (redirect.statusCode === 301) {
        permanent = true;
      } else {
        permanent = false;
      }

      return {
        source,
        destination,
        permanent,
      };
    });

    return redirects;
  },
};