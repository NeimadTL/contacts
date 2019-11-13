module Mutations
  class DeleteContact < BaseMutation
    # arguments passed to the `resolved` method
    argument :id, ID, required: true

    # return type from the mutation
    type Types::ContactType

    def resolve(id: nil)
      contact = Contact.find(id)
      contact.destroy
    end
  end
end
