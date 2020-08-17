var sdkToken = "NETLESSSDK_YWs9Y1ZfQlRBMEcxekc5S19NbiZub25jZT0xNTk3NjEwMTAxNDE2MDAmcm9sZT0wJnNpZz1lMjU0MTQ4MWQzZDhhOTUyYTEzYTMxOTE2YjI5ZjNlMWMxYmU3NjYxNTZjOWFkNGI1M2U4OGRlOTRmZDQ2MDJm";
let uuid = 'namdaica123'
var url = `https://cloudcapiv4.herewhite.com/room?token=${sdkToken}&uuid=${uuid}`;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        name: "room name",
        limit: 0, // Limit on the number of rooms
        mode: "persistent",  // Normal room, unable to play back
        // mode: "historied"， // Playback room
    }),
};
var firebaseConfig = {
    apiKey: "AIzaSyCHwB8S2pGDecPzik0xB1JNyluCVohyTlk",
    authDomain: "chat-app-bc2a8.firebaseapp.com",
    databaseURL: "https://chat-app-bc2a8.firebaseio.com",
    projectId: "chat-app-bc2a8",
    storageBucket: "chat-app-bc2a8.appspot.com",
    messagingSenderId: "922317285890",
    appId: "1:922317285890:web:fbac59705c66cf64a7551b"
  };
  firebase.initializeApp(firebaseConfig);
let rooms = null;
let eraser = document.getElementById('eraser')
let join = document.getElementById('join')
let pencil = document.getElementById('pencil')
let rectangle = document.getElementById('rectangle')
let exitBnt = document.getElementById('exit')
let upload = document.getElementById('upload')

let teacher = false

let whiteWebSdk  = new WhiteWebSdk();


let createRoomBnt = document.getElementById('create-room')
createRoomBnt.addEventListener('click',(e)=>{
    fetch(url, requestInit).then(function(response) {
        return response.json();
    }).then(function(json) {
        teacher = true
        console.log(json);
        firebase.database().ref('key').set(json);
    }).catch(function(err) {
        console.error(err);
    });
})

let db = firebase.database().ref('key');
    db.on('child_added', function(data) {
        console.log(data.val());
        rooms = data.val();
    });
exitBnt.addEventListener('click',()=>{
    firebase.database().ref('key').remove()
    window.location.reload()
})
join.addEventListener('click',()=>{
    if(rooms.length > 0){
        const pptConverter = whiteWebSdk.pptConverter(`${rooms[1].roomToken}`);
        whiteWebSdk.joinRoom({
            uuid: rooms[1].room.uuid,
            roomToken: rooms[1].roomToken,
            isWritable: teacher
        }).then(function(room) {
            // Bind the room instance to a global variable. All subsequent API instances will directly call room
            window.room = room;
            room.bindHtmlElement(document.getElementById("whiteboard"));
            pencil.addEventListener('click',()=>{
                room.setMemberState({
                    currentApplianceName: "pencil",
                    strokeColor: [255, 0, 0],
                    strokeWidth: 4,
                    textSize: 14,
                });
            })
            rectangle.addEventListener('click',()=>{
                room.setMemberState({
                    currentApplianceName: "rectangle",
                    strokeColor: [255, 0, 0],
                    strokeWidth: 4,
                    textSize: 14,
                });
            })
            eraser.addEventListener('click',()=>{
                room.setMemberState({
                    currentApplianceName: "eraser",
                    strokeColor: [255, 0, 0],
                    strokeWidth: 4,
                    textSize: 14,
                });
            })
            upload.addEventListener('click', async ()=>{
                // res = await pptConverter.convert({
                //     // The network address of the resource that needs to be converted, please ensure that it can be accessed normally
                //     url: "https://www.google.com/url?sa=i&url=http%3A%2F%2Fdangcongsan.vn%2Ftu-tuong-van-hoa%2Fgioi-thieu-nhung-hinh-anh-dep-ve-ha-noi-500655.html&psig=AOvVaw2cVmey1-wdQoLibFKNpaUI&ust=1597759088850000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPjmrsmyousCFQAAAAAdAAAAABAD",
                //     // Conversion type
                //     kind: "static" | "dynamic", 
                //     // Conversion progress monitoring
                //     // onProgressUpdated: progress => {
                //     //   console.log(progress);
                //     // },
                //     // checkProgressInterval: 1500,
                //     // checkProgressTimeout: 5 * 60 * 1000,
                // });
                // room.putScenes(`/ppt`, res.scenes);
                // // The put API just adds a whiteboard and does not actively switch. You need to actively set to the exact path through setAPI.
                // room.setScenePath(`/ppt/${res.scenes[0].name}`)
            })
        })
    }
    else console.log('khong co room');
})
