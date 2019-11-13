require 'rails_helper'

module Mutations
  module Contacts
    RSpec.describe DeleteContact, type: :request do
      describe 'resolve' do
        it 'delete a contact' do
          damien = Contact.create!(
            name: 'Damien', address: '2 rue paul belomondo',
            postal_code: '93160', city: 'noisy le grand')

          expect do
            post '/graphql', params: { query: query(id: damien.id) }
          end.to change { Contact.count }.by(-1)
        end
      end

      def query(id:)
        <<~GQL
          mutation {
            deleteContact(id: #{id}) {
              id
              name
              name
              address
              postalCode
              city
            }
          }
        GQL
      end

    end
  end
end
