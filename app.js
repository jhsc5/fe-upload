import { initializeApp } from 'firebase/app'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import { upload } from './upload'

const firebaseConfig = {
    apiKey: 'AIzaSyA7zcHs-71tXVtVCZliieC_HDXcsggVTcM',
    authDomain: 'fe-upload-598b0.firebaseapp.com',
    projectId: 'fe-upload-598b0',
    storageBucket: 'fe-upload-598b0.appspot.com',
    messagingSenderId: '555053910847',
    appId: '1:555053910847:web:24f7edf93165adb4fa218a',
    measurementId: 'G-5ZWSMN181F',
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const storageRef = ref(storage, `images/${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percentage =
                        (
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100
                        ).toFixed(0) + '%'
                    const block = blocks[index].querySelector(
                        '.preview-info-progress'
                    )
                    block.textContent = percentage
                    block.style.width = percentage
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        console.log('Download URL:', url)
                    })
                }
            )
        })
    },
})
