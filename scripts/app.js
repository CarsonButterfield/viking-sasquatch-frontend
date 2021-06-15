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

//REGEX that I found online
function isValid(str){
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str) && str != "";
   }

//Quick little form validation function
const validateForm = ( formType ) => {

    let errorCount = 0;
    //assigning the values to variables for readability and to reduce queries
    const factoryName = $(`#factory-name-${formType}`)
    const factoryMinVal = $(`#factory-minVal-${formType}`)
    const factoryMaxVal = $(`#factory-maxVal-${formType}`)
    const factoryChildCount = $(`#factory-childCount-${formType}`)


    if(!isValid(factoryName.val())){
        factoryName.addClass('is-invalid')
        $(`#factory-name-${formType}-invalid`).show()
        errorCount++
    }else{
        factoryName.removeClass('is-invalid')
        $(`#factory-name-${formType}-invalid`).hide()
    }
  
    //Making sure minval is a number and greater than or equal to 0\
    if(isNaN(factoryMinVal.val()) || factoryMinVal.val() < 0 || Number(factoryMinVal.val()) > Number(factoryMaxVal.val())){
        factoryMinVal.addClass('is-invalid')
        $(`#factory-minVal-${formType}-invalid`).show()
        errorCount++
    }else{
        factoryMinVal.removeClass('is-invalid')
        $(`#factory-minVal-${formType}-invalid`).hide()
    }

    if(isNaN(factoryMaxVal.val()) || factoryMaxVal.val() < 0){
        factoryMaxVal.addClass('is-invalid')
        $(`#factory-maxVal-${formType}-invalid`).show()
        errorCount++
    }else{
        factoryMaxVal.removeClass('is-invalid')
        $(`#factory-maxVal-${formType}-invalid`).hide()
    }
    
    if(factoryChildCount.val() == ""){
        factoryChildCount.addClass('is-invalid')
        $(`#factory-childCount-${formType}-invalid`).show()
        errorCount++
    } else {
        factoryChildCount.removeClass('is-invalid')
        $(`#factory-childCount-${formType}-invalid`).hide()
    }
    //for readability when used
    return errorCount == 0
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
    console.log($('#factory-childCount-edit').val())
})

$('#factories').on('click', '.delete-factory', function(e){
    axios.delete(`${API}/factories/${this.parentElement.id}`)
    .then(res => {
        console.log(res.status)
    }).catch(err => console.log(err))

})


$('#factories').on('click', '.edit-factory', function(e){
    const factory = this.parentElement.parentElement
    $('#factory-name-edit').val(factory.dataset.name)
    $('#factory-maxVal-edit').val(factory.dataset.maxval)
    $('#factory-minVal-edit').val(factory.dataset.minval)
    $('#factory-childCount-edit').val(factory.dataset.childcount)
    $('#save-edits').data("_id",factory.id)

    $('#factory-name-edit').removeClass('is-invalid')
    $('#factory-maxVal-edit').removeClass('is-invalid')
    $('#factory-minVal-edit').removeClass('is-invalid')
    $('#factory-childCount-edit').removeClass('is-invalid')


    $(`#factory-minVal-edit-invalid`).hide()
    $(`#factory-maxVal-edit-invalid`).hide()
    $(`#factory-childCount-edit-invalid`).hide()
    $(`#factory-name-edit-invalid`).hide()

    $('#edit-modal').modal('toggle')
})

$('#save-edits').click( function(e) {
    const changedFactory = {
        name:$('#factory-name-edit').val(),
        maxVal: $('#factory-maxVal-edit').val(),
        minVal: $('#factory-minVal-edit').val(),
        childCount:$('#factory-childCount-edit').val()
    }
    const id = $(this).data('_id')
    if(validateForm('edit')){
        
        axios.put(`${API}/factories/${id}`, changedFactory)
        .then(res => console.log(res.status))
        .catch(err => console.log(err))
        $('#edit-modal').modal('hide')

    }
})

$('.close').click( function(e){
    $('#edit-modal').modal('hide')
    $('#create-modal').modal('hide')
})


$('#factories').on('click', '.create-children', function(e){
    axios.put(`${API}/factories/${this.parentElement.parentElement.id}/children`)
    .then(res => {
        console.log(res.status)
    }).catch(err => console.log(err))
})

$('#create-factory').click(e=> {
    $('#factory-name-create').val("")
    $('#factory-maxVal-create').val(""),
    $('#factory-minVal-create').val(""),
    $('#factory-childCount-create').val("")
    $('#create-modal').modal('toggle')
})

$('#post-factory').click(e => {
    const newFactory = {
        name:$('#factory-name-create').val(),
        maxVal: $('#factory-maxVal-create').val(),
        minVal: $('#factory-minVal-create').val(),
        childCount:$('#factory-childCount-create').val()
    }

    if(validateForm('create', newFactory)){
        axios.post(`${API}/factories`,newFactory)
        .then(res => {
            console.log(res.status)
        }).catch(err => {
            console.log(err)
        })
        
        $('#create-modal').modal('hide')
    }



})
