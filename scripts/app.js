const API = 'http://localhost:3000'
let masterNode

const socket = new WebSocket(`ws://localhost:3000/updates`)
socket.onmessage = msg => {
    console.log('message recieved')
    masterNode = JSON.parse(msg.data)
    // console.log(masterNode.factories)
    renderFactories()
}

socket.onclose = () => {
    console.log('closed connection')
}

const renderFactories = () => {
    $('#factories').empty();
    for(factory of masterNode.factories){
        createFactory(factory)
    }
}
axios.get('http://localhost:3000').then(res => {
    masterNode = res.data
    renderFactories()
    console.log(res.status)
}).catch(err => {
    console.log(err)
})

$('#root').click(e => {
    socket.send(JSON.stringify({msg:"big bean burrito"}))
})

$('#factories').on('click', '.delete-factory', function(e){
    axios.delete(`${API}/factories/${this.parentElement.id}`)
    .then(res => {
        console.log(res.status)
    }).catch(err => console.log(err))

})


$('#factories').on('click', '.edit-factory', function(e){
    const factory = this.parentElement.parentElement
    console.log(factory)
    $('#factory-name-edit').val(factory.dataset.name)
    $('#factory-maxVal-edit').val(factory.dataset.maxval)
    $('#factory-minVal-edit').val(factory.dataset.minval)
    $('#factory-childCount-edit').val(factory.dataset.childcount)
    $('#save-edits').data("_id",factory.id)

  $('#edit-modal').show()
})

$('#save-edits').click( function(e) {
    const changedFactory = {
        name:$('#factory-name-edit').val(),
        maxVal: $('#factory-maxVal-edit').val(),
        minVal: $('#factory-minVal-edit').val(),
        childCount:$('#factory-childCount-edit').val()
    }
    const id = $(this).data('_id')
    axios.put(`${API}/factories/${id}`, changedFactory)
    .then(res => console.log(res.status))
    .catch(err => console.log(err))
})

$('#edit-modal .close').click( function(e){
    $('#edit-modal').hide()
})

$('#factories').on('click', '.create-children', function(e){
    axios.put(`${API}/factories/${this.parentElement.parentElement.id}/children`)
    .then(res => {
        console.log(res.status)
    }).catch(err => console.log(err))
})

$('#create-factory').click(e=> {
    axios.post(`${API}/factories`)
    .then(res => {
        console.log(res.status)
    })
})
