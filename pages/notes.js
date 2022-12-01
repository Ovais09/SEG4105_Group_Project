import { db, auth } from '../firebaseconfig'
import { query, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from '../styles/notes.module.css'

const url = 'http://ec2-3-83-80-59.compute-1.amazonaws.com:8080'

function Notes() {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [notes, setNotes] = useState([])
    const inputRef = useRef('')
    const textareaRef = useRef('')
    const router = useRouter()

    async function getNotes(userID) {

        const response = await axios.get(`${url}/${userID}/allNotes`)
        return response.data

    }




    // useEffect(() => {
    //     SetUserNotes([])
    //     notes.forEach((element) => {
    //         // if (element.uid === router.query.uid) {
    //         console.log(element)
    //         SetUserNotes(usernotes => [...usernotes, element])
    //         // }
    //     })
    // }, [notes])

    useEffect(() => {
        (async () => getNotes(router.query.uid))().then((data) => {
            setNotes(data.documents)
        })
    }, [notes])

    async function handleSubmit(event) {

        async function addNotes(userID) {
            const response = axios.post(`${url}/${userID}/addNote`, {
                title: inputRef.current.value,
                description: textareaRef.current.value
            })

            return response.data

        }

        event.preventDefault();

        addNotes(router.query.uid)

        inputRef.current.value = ''
        textareaRef.current.value = ''

    }

    async function deleteNote(id) {
        axios.delete(`${url}/${router.query.uid}/deleteNote/${id}`)
    }

    async function updateNote(id) {

        console.log(title)
        console.log(description)

        const response = axios.put(`${url}/${router.query.uid}/updateNote/${id}`, {
            title: title,
            description: description,
            uid: router.query.uid
        })

        inputRef.current.value = ''
        textareaRef.current.value = ''

        // return response.data
    }

    return (
        <div>
            {notes.map((element) => {

                return (
                    <div key={element.id}>
                        <div className={styles.card}>
                            <div className={styles.container}>
                                <p>{element.title}</p>
                                <p>{element.description}</p>
                                <button type="button" onClick={() => deleteNote(element.noteId)}>Delete Note</button>
                                <button type="button" onClick={() => updateNote(element.noteId)}>Update Note</button>
                            </div>
                        </div>
                        <br /><br />
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

// export async function getServerSideProps(context) {





//     const new_notes = await getNotes(context.query.uid)


//     return {
//         props: {
//             props: new_notes.documents
//         }
//     }
// }