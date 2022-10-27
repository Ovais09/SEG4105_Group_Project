import { db, auth } from '../firebaseconfig'
import { query, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'


function Notes({ props }) {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [notes, setNotes] = useState([...props])
    const [usernotes, SetUserNotes] = useState([])
    const inputRef = useRef('')
    const textareaRef = useRef('')
    const router = useRouter()

    // const usernotes = []

    useEffect(() => {

        console.log(router.query.uid)
        console.log(notes)
        SetUserNotes([])
        notes.forEach((element) => {
            if (element.uid === router.query.uid) {
                console.log(element)
                SetUserNotes(usernotes => [...usernotes, element])
                // console.log(usernotes);
                // usernotes.push(element)
            }
        })

        // console.log(usernotes)
    }, [notes])

    async function handleSubmit(event) {
        event.preventDefault();
        const docRef = doc(collection(db, 'Notes'))

        console.log(title, description)

        await setDoc(doc(db, 'Notes', docRef.id), {
            title: inputRef.current.value,
            description: textareaRef.current.value,
            uid: router.query.uid
        })

        setNotes([...notes, { title: inputRef.current.value, description: textareaRef.current.value, uid: router.query.uid }])

        inputRef.current.value = ''
        textareaRef.current.value = ''

    }

    console.log(usernotes)
    return (
        <div>
            {usernotes.map((element) => {

                return (
                    <div key={element.id}>
                        <h1>{element.title}</h1>
                        <h1>{element.description}</h1>
                        <hr></hr>
                    </div>
                )
            })}

            <form action='/notes' onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label> <br />
                <input type="text" id="title" placeholder="Title" onChange={e => setTitle(e.target.value)} ref={inputRef} /> <br /> <br />
                <label htmlFor="description">Description</label> <br />
                <textarea ref={textareaRef} placeholder="Description" onChange={e => setDescription(e.target.value)}></textarea> <br />
                <input type="submit" value="Add Note" />
            </form>
        </div>
    )
}

export default Notes

export async function getStaticProps() {



    const notes = []
    const q = query(collection(db, 'Notes'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
        const docRef = doc(collection(db, 'Notes'))
        notes.push({
            id: docRef.id,
            description: document.data().description,
            title: document.data().title,
            uid: document.data().uid
        })
    });

    return {
        props: {
            props: notes
        }
    }
}