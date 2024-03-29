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

export const getPosts = async (userId) =>{
    let query = postsCollection.orderBy('createdAt','desc').limit(PAGE_SIZE);
    if(userId) {
        query = query.where('user.id','==',userId)
    }
    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    }))
    return posts;
}

export const getOlderPosts = async(id,userId)=> {
    const cursorDoc = await postsCollection.doc(id).get();
    let query = postsCollection
        .orderBy('createdAt','desc')
        .startAfter(cursorDoc)
        .limit(PAGE_SIZE)
    if(userId) {
        query = query.where('user.id','==',userId)
    }
    const snapshot = await query.get();

    const posts = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    }))
    return posts;
}

export const getNewerPosts = async (id,userId) => {
    const cursorDoc = await postsCollection.doc(id).get();
    let query = postsCollection
        .orderBy('createdAt', 'desc')
        .endBefore(cursorDoc)
        .limit(PAGE_SIZE)
    if(userId) {
        query = query.where('user.id','==', userId)
    }
    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    }))
    return posts;
}