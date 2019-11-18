import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout/Layout.jsx'
import { ApolloProvider, Query } from 'react-apollo'
import ContactList from '../ContactList/ContactList.jsx'
import ContactDetails from '../ContactDetails/ContactDetails.jsx'
import NewContact from '../NewContact/NewContact.jsx'
import * as queries from '../graphql/queries.gql'
import graphQlClient from '../graphql/client.js'
import axios from 'axios'
import csrfToken from 'helpers/csrfToken.js'
import './ContactBook.scss'
import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';

const ContactBook = () => (
  <ApolloProvider client={graphQlClient}>
    <Query query={queries.contactBook}>
      { (props) => <ContactBookUI {...props} /> }
    </Query>
  </ApolloProvider>
)

const ContactBookUI = ({ loading, error, data, refetch }) => {
  const { contacts } = data || {}
  const [selectedContact, setSelectedContact] = useState(null)
  const selectContact = (contact) => setSelectedContact(contact)
  const deselectContact = () => setSelectedContact(null)

  return (
    <Layout>
      <div className='ContactBook'>
        { loading && <span className='loading'>Loading...</span> }
        { error && <span className='error'>{ error.message || 'An unexpected error occurred' }</span> }
        { contacts && <ContactList contacts={contacts} selectContact={selectContact} /> }
        { selectedContact && <ContactDetails contact={selectedContact} deselectContact={deselectContact} deleteContact={deleteContact} /> }
        <NewContact createContact={checkDuplicatesAndCreate} onSuccess={refetch} />
      </div>
    </Layout>
  )
}

ContactBookUI.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  data: PropTypes.shape({
    data: PropTypes.array
  })
}

const createContact = ({ name, address, postalCode, city }) =>
  axios.post('/contacts', {
    contact: {
      name,
      address,
      postal_code: postalCode,
      city
    },
    authenticity_token: csrfToken()
  }, {
    headers: { 'Accept': 'application/json' },
    responseType: 'json'
  })

const DELETE_MUTATION = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      id
      name
      address
      postalCode
      city
    }
  }
`;

const deleteContact = (deleteContact) => {
  const [deleteMutation, { data }] = useMutation(DELETE_MUTATION);
    // deleteMutation({ variables: { id: ContactDetails.propTypes.contact.id } })
  }

const deleteMutation = () =>
  console.log("begin deleteContact");
  <Mutation object={deleteContact}>
    {(deleteContact, { data }) => (this.deleteContact(deleteContact))}
  </Mutation>


const findNearDuplicates = ({ name, address, postalCode, city }) =>
  axios.get('/contacts/near_duplicates', {
    params: {
      'contact[name]': name,
      'contact[address]': address,
      'contact[postal_code]': postalCode,
      'contact[city]': city
    },
    headers: { 'Accept': 'application/json' },
    responseType: 'json'
  })

const checkDuplicatesAndCreate = (newContact) =>
  findNearDuplicates(newContact).then(({ data: duplicates }) => {
    if (duplicates.length === 0 || confirmDuplicates(duplicates)) {
      return createContact(newContact)
    }

    return false
  })

const confirmDuplicates = (duplicates) => {
  const duplicatesPreview = duplicates.map(({ name, address, postal_code: postalCode, city }) =>
    `${name}, ${address}, ${postalCode}, ${city}`
  ).join('\n')

  return window.confirm(`The contact you are creating might be a duplicate of:
    \n${duplicatesPreview}
    \nDo you still want to create it?`)
}

export default ContactBook
export { ContactBookUI, createContact, findNearDuplicates }
