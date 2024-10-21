
export async function firebaseSend(data, length)  {
    let location = []   
      let flag = false
      if(route.params.lat >= 90 || route.params.lng >= 90 ||route.params.lat <0  || route.params.lng < 0 ){
          flag= true
          location.push(Math.random() * (11.7920 - 11.7820) + 11.7820)
          location.push(Math.random() * (41.0130 - 41.0030) + 41.0030)
      }
      data['location'] = flag ? location: [route.params.lng, route.params.lat]
      data._id = uuid.v4()
      console.log("Data to be sent,", data)
    try {
        
                if(length === 0)
                {
                  await setDoc(doc(database, 'newreports', context.chatID), {
                    messages: arrayUnion(data),
                    lastUpdated: Date.now(),
                });
                }
                else{
    
                  await updateDoc(doc(database, 'newreports', context.chatID), {
                      messages: arrayUnion(data),
                      lastUpdated: Date.now(),
                  });
         console.log("Added Successfully!")
        }
        } catch (error) {
          console.log(error)
        }
}
 
