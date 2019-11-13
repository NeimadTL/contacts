# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :delete_contact, mutation: Mutations::DeleteContact
  end
end
