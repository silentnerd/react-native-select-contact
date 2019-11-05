'use strict';

import {
    Alert,
    NativeModules,
    Platform
} from 'react-native';

const { SelectContact } = NativeModules;

let currentlyOpen = false;

const SelectContactApi = {

    selectContact() {
        if (currentlyOpen) {
            return Promise.reject(new Error('Cannot open the contact selector twice'));
        }

        currentlyOpen = true;

        return SelectContact.openContactSelection()
            .then(contact => {
                currentlyOpen = false;
                return contact;
            })
            .catch(err => {
                currentlyOpen = false;

                // Resolve to null when cancelled
                if (err.code === 'E_CONTACT_CANCELLED') {
                    return null;
                }

                throw err;
            });
    },

    selectContactPostalAddress() {
      return SelectContactApi.selectContact()
          .then(contact => {
              if (!contact) {
                  return null;
              }

              let addresses = contact && contact.postalAddresses || [];
              if (addresses.length === 0) {
                  Alert.alert('No Postal Addresses', `We could not find any postal addresses for ${contact.name}`);
                  return null;
              }

              return selectPostalAddress(addresses)
                  .then(selectedAddress => {
                      return selectedAddress ? { contact, selectedAddress } : null;
                  });
          })
    },

    selectContactPhone() {
        return SelectContactApi.selectContact()
            .then(contact => {
                if (!contact) {
                    return null;
                }

                let phones = contact && contact.phones || [];
                if (phones.length === 0) {
                    Alert.alert('No Phone Numbers', `We could not find any phone numbers for ${contact.name}`);
                    return null;
                }

                return selectPhone(phones)
                    .then(phones_details => {
                        return phones_details;
                    });
            });
    },

    selectContactEmail() {
        return SelectContactApi.selectContact()
            .then(contact => {
                if (!contact) {
                    return null;
                }

                let emails = contact && contact.emails || [];
                if (emails.length === 0) {
                    Alert.alert('No Email Addresses', `We could not find any email addresses for ${contact.name}`);
                    return null;
                }

                return selectEmail(emails)
                    .then(selectedEmail => {
                        return selectedEmail ? { contact, selectedEmail } : null;
                    });
            });
    }

};

module.exports = SelectContactApi;


function selectPhone(phones) {
    if (phones.length < 2) {
        return Promise.resolve(phones[0]);
    }

    let options = [...new Set(phones.map(phone => phone.number))];

    return Promise.resolve(options);
}

function selectPostalAddress(addresses) {
  if (addresses.length < 2) {
    return Promise.resolve(addresses[0]);
  }

  let options = addresses.map(address => {
    let { formattedAddress, street, city, state, postalCode, isoCountryCode } = address;

    if (formattedAddress) {
      return formattedAddress;
    }

    return `${street} ${city}, ${state} ${postalCode} ${isoCountryCode}`;
  });


  return Promise.resolve(options);
}

function selectEmail(emails) {
    if (emails.length < 2) {
        return Promise.resolve(emails[0]);
    }

    let options = emails.map(email => {
        let { address, type } = email;
        return address + (type ? ` - ${type}` : '');
    });

    return Promise.resolve(options);
    
}
