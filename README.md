# react-native-contact

This is simple wrapper that return an array of contacts which can be handled by the developer for their specific use.

### Installation

```
yarn add react-native-contact
```

For React Native => 0.59 only:
```
react-native link react-native-contact
```

Make sure your manifest files includes permission to read contacts
```
<uses-permission android:name="android.permission.READ_CONTACTS" />
```

### API

#### Methods

```
selectContact(): Promise<Contact | null>;
selectContactPhone(): Promise<ContactPhoneSelection | null>;
selectContactEmail(): Promise<ContactEmailSelection | null>;
selectContactPostalAddress(): Promise<ContactPostalAddressSelection | null>;
```

These methods all will return an array. Which in turn can be handled by the developer for their specific need.

#### Types

```typescript
interface PhoneEntry {
    number: string,
    type: string
}

interface EmailEntry {
    address: string,
    type: string
}

interface AddressEntry {
    formattedAddress: string, // android only
    type: string, // android only
    street: string,
    city: string,
    state: string,
    postalCode: string,
    isoCountryCode: string
}

interface Contact {
    name: string,
    phones: PhoneEntry[],
    emails: EmailEntry[],
    postalAddresses: AddressEntry[]
}

interface ContactPhoneSelection {
    contact: Contact,
    selectedPhone: PhoneEntry
}

interface ContactEmailSelection {
    contact: Contact,
    selectedEmail: EmailEntry
}

interface ContactPostalAddressSelection {
    contact: Contact,
    selectedAddress: AddressEntry
}
```

### Example

```javascript

import { selectContactPhone } from 'react-native-contact';

function getPhoneNumber() {
    return selectContactPhone()
        .then(selection => {
            if (!selection) {
                return null;
            }
     
            console.log('Contact phone numbers: '+selection);
        });  
}


```