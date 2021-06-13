const API = 'http://localhost:3000'
let masterNode

const socket = new WebSocket(`ws://localhost:3000/updates`)
socket.onmessage = msg => {
    console.log('message recieved')
    masterNode = JSON.parse(msg.data)
    console.log(masterNode.factories)
    renderFactories()
}

const renderFactories = () => {
    console.log(masterNode)
    $('#factories').empty();
    for(factory of masterNode.factories){
        createFactory(factory)
    }
}
axios.get('http://localhost:3000').then(res => {
    masterNode = res.data
    renderFactories()
}).catch(err => {
    console.log(err)
})

$('#root').click(e => {
    socket.send(JSON.stringify({msg:"big bean burrito"}))
})

$('#factories').on('click', '.delete-factory', function(e){
    axios.delete(`${API}/factories/${this.parentElement.id}`)
    .then(res => {
        renderFactories()
    }).catch(err => console.log(err))

})

$('#factories').on('click', '.create-children', function(e){
    axios.put(`${API}/factories/${this.parentElement.id}/children`)
    .then(res => {
        console.log(res.data)
        masterNode = res.data;
        renderFactories()
    }).catch(err => console.log(err))
})

$('#create-factory').click(e=> {
    axios.post(`${API}/factories`)
    .then(res => {
        masterNode = res.data
        renderFactories()
    })
})
