import agility from "@agility/content-fetch"

export default async (req, res) => {

    const { skip, take } = req.query

    const api = agility.getApi({
        guid: process.env.AGILITY_GUID,
        apiKey: process.env.AGILITY_API_FETCH_KEY
    })

    const contacts = await api.getContentList({
        referenceName: 'contacts',
        languageCode: 'en-us',
        take: take,
        skip: skip
    })

  res.status(200).json({ contacts: contacts.items })
};
