async function uploadImageAsync(files) {

    const file = files;
    console.log("File", file)
    const fileRef = ref(storage, `chats/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);
    

    uploadTask.on(
      'state_changed',
      () => {},
      (error) => {
        console.error('Upload failed:', error);
      },)
    try {
        const fileUrl = await getDownloadURL(fileRef);
        file
        let data = {
            _id: uuid.v4(),
            createdAt: new Date(),
            received: false,
            sent: true,
            text: '',
            user : {
              _id: '',
              avatar: '',
              name : ''      
            },
            fileUrl,
            filename: file.fileName,
            fileType: file.mimeType,
          }
        
        
        console.log("--------", data)
        const chatRef = await addDoc(collection(database, 'newreports'), {
            messages: arrayUnion(data),  
            lastUpdated: Date.now(),
            location:  [route.params.lng, route.params.lat],
         });
        console.log("Added Successfully!")
        setChatID(chatRef.id)

      }
      catch (e)
      {
        console.log(e)
      }
}