import { db, auth } from '../firebaseconfig'
import { query, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Card from 'react-bootstrap/Card';


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
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>{element.title}</Card.Title>
                                <Card.Text>{element.description}</Card.Text>
                            </Card.Body>
                        </Card>
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

export async function getServerSideProps(context) {

    async function getNotes(userID) {
        
        const response = await axios.get(`http://ec2-54-204-67-9.compute-1.amazonaws.com:8080/${userID}/allNotes`)
        return response.data
        
    }

    const new_notes = await getNotes(context.query.uid)
    console.log(new_notes)


    return {
        props: {
            props: new_notes.documents
        }
    }
}