import React, { useState } from 'react'
import { AgilityImage } from "@agility/nextjs"
import axios from "axios"

const Contacts = ({ customData, isPreview }) => {

  const { contacts, totalCount } = customData;

  const [skip, setSkip] = useState(4)
  const [take, setTake] = useState(4);
  const [loading, setLoading] = useState(false)
  const [loadedContacts, setLoadedContacts] = useState([])

  const loadMoreContacts = async () => {
    setLoading(true)
    setSkip(skip + 4)
    setTimeout(async () => {
      const { data } = await axios.get(`/api/getContacts?skip=${skip}&take=${take}`)
      setLoadedContacts(prevState => [...prevState, ...data.contacts])
      setLoading(false)
    }, 500)
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-4 gap-8">
        {contacts.map((contact, index) => (
          <div key={index}>
            <div className='relative h-64'>
              <AgilityImage
                src={contact.fields.image.url}
                alt={contact.fields.image.label}
                className="object-cover object-center rounded-lg"
                layout="fill"
              />
            </div>
            <p className='text-xl mt-2 font-bold'>{contact.fields.name}</p>
            <span className='text-gray-600'>{contact.fields.position}</span>
          </div>
        ))}
        {loadedContacts && loadedContacts.map((contact, index) => (
          <div key={index}>
            <div className='relative h-64'>
              <AgilityImage
                src={contact.fields.image.url}
                alt={contact.fields.image.label}
                className="object-cover object-center rounded-lg"
                layout="fill"
              />
            </div>
            <p className='text-xl mt-2 font-bold'>{contact.fields.name}</p>
            <span className='text-gray-600'>{contact.fields.position}</span>
          </div>
        ))}
      </div>
      {totalCount - 4 !== loadedContacts.length && (
        <div className='text-center mt-20'>
          <button onClick={loadMoreContacts} className="bg-primary-400 text-white p-4 rounded-lg w-40 mx-auto text-center">
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Contacts

Contacts.getCustomInitialProps = async ({
  agility,
  languageCode,
}) => {

  const api = agility

  try {

    const contacts = await api.getContentList({
      referenceName: 'contacts',
      languageCode,
      take: 4,
      sort: 'properties.itemOrder',
      direction: api.types.SortDirections.ASC
    })

    return {
      contacts: contacts.items,
      totalCount: contacts.totalCount
    }

  } catch (err) {
    console.log(err)
  }
}