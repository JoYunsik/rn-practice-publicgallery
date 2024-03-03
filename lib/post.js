import firestore from '@react-native-firebase/firestore';

const postsCollection = firestore().collection('posts');

export const createPost = ({user,photoURL,description}) => {
    return postsCollection.add({
        user,
        photoURL,
        description,
        createdAt: firestore.FieldValue.serverTimestamp()
    })
}