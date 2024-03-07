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

export const PAGE_SIZE = 3;

export const getPosts = async () =>{
    const snapshot = await postsCollection.orderBy('createdAt','desc').limit(PAGE_SIZE).get();
    const posts = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    }))
    return posts;
}

export const getOlderPosts = async(id)=> {
    const cursorDoc = await postsCollection.doc(id).get();
    const snapshot = await postsCollection
        .orderBy('createdAt','desc')
        .startAfter(cursorDoc)
        .limit(PAGE_SIZE)
        .get()

    const posts = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    }))
    return posts;
}

export const getNewerPosts = async (id) => {
    const cursorDoc = await postsCollection.doc(id).get();
    const snapshot = await postsCollection
        .orderBy('createdAt', 'desc')
        .endBefore(cursorDoc)
        .limit(PAGE_SIZE)
        .get()
    const posts = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data
    }))
    return posts;
}