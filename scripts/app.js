let masterNode

const renderFactories = () => {
    $('#factories').empty();
    for(factory of masterNode.factories){
        createFactory(factory)
    }
}
axios.get('http://localhost:3000').then(res => {
    masterNode = res.data
    console.log(masterNode)
}).catch(err => {
    console.log(err)
})

$('#root').click(e => {
    renderFactories()
})