# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :contacts, [Types::ContactType], null: false, description: 'Get all contacts'
    field :contact, Types::ContactType, null: false do
       description 'Get contact by ID'
       argument :id, ID, required: true
    end

    def contacts
      ::Contact.all
    end

    def contact(id:)
      ::Contact.find(id)
    end
  end
end
