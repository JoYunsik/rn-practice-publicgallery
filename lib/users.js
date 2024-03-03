import firestore from "@react-native-firebase/firestore";

export const userCollection = firestore().collection('users');

export const createUser = ({id,displayName,photoURL})=>{
    return userCollection.doc(id).set({
        id,displayName,photoURL,
    })
}

export const getUser = async (id) => {
    const doc = await userCollection.doc(id).get();
    return doc.data()
}