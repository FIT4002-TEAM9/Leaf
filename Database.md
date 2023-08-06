# Database

#### Introduction

We're using Firebase. https://docs.expo.dev/guides/using-firebase/.

*Note that specifically, we're using the Firebase JS SDK which supports Expo Go. We're NOT using React Native Firebase.*

#### Setup Steps

Create a new project at https://console.firebase.google.com/u/0/?pli=1. 

> I called ours "Leaf". It's available at https://console.firebase.google.com/u/0/project/leaf-f184f/overview.

Then run:

```
npx expo install firebase
```

Next we register our app. Go to our firebase project and click the **Web **(**</>**) icon to add a new app. You'll get a bunch of code.

> ```
> // Import the functions you need from the SDKs you need
> import { initializeApp } from "firebase/app";
> import { getAnalytics } from "firebase/analytics";
> // TODO: Add SDKs for Firebase products that you want to use
> // https://firebase.google.com/docs/web/setup#available-libraries
> 
> // Your web app's Firebase configuration
> // For Firebase JS SDK v7.20.0 and later, measurementId is optional
> const firebaseConfig = {
>   apiKey: "AIzaSyD9cKsA2JghkrDHNhOvBmqOUPa8_jx-Dg4",
>   authDomain: "leaf-f184f.firebaseapp.com",
>   projectId: "leaf-f184f",
>   storageBucket: "leaf-f184f.appspot.com",
>   messagingSenderId: "958929199285",
>   appId: "1:958929199285:web:473b2d7be90466e3659efc",
>   measurementId: "G-49C9WMRJM1"
> };
> 
> // Initialize Firebase
> const app = initializeApp(firebaseConfig);
> const analytics = getAnalytics(app);
> ```

Adjust the code block and add it to a new file "firebaseConfig.js".

> ```
> import { initializeApp } from "firebase/app";
> import { getFirestore } from "firebase/firestore";
> 
> // Firebase config
> const firebaseConfig = {
>   apiKey: "AIzaSyD9cKsA2JghkrDHNhOvBmqOUPa8_jx-Dg4",
>   authDomain: "leaf-f184f.firebaseapp.com",
>   projectId: "leaf-f184f",
>   storageBucket: "leaf-f184f.appspot.com",
>   messagingSenderId: "958929199285",
>   appId: "1:958929199285:web:473b2d7be90466e3659efc",
>   measurementId: "G-49C9WMRJM1"
> };
> 
> // Initialize Firebase
> const app = initializeApp(firebaseConfig);
> export const db = getFirestore(app);
> ```

Then run:

```
npx expo customize metro.config.js
```

Then replace everything in "metro.config.js" to:

```js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
```

Then go to your Firebase project. In the left toolbar, select Build then select Firestore Database. Go through the steps of creation. I put the region to Sydney because this is an Australian app and we want speeeed. I also set it to test mode because it's easier to set up this way.

Okay, everything is setup. Try running the following in-app:

```typescript
import { collection, addDoc } from "firebase/firestore";
import { db } from "firebaseConfig";

// ...

try {
    const docRef = await addDoc(collection(db, "users"), {
        first: "Yeet",
        last: "Lovelace",
        born: 1815
    });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
}
```

You should see the document pop up in the **Data**, **Panel view** section of the app (with the collections and data and stuff).

