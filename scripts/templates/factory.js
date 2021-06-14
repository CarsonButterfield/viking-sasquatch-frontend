//adds a factory element to the appropriate div 


const factoryTemplate = (factory) => `
    <div id=${factory._id} data-name="${factory.name}" data-maxVal=${factory.maxVal} data-minVal=${factory.minVal} data-childcount="${factory.childCount}" class="factory card">
        <h2 class="card-title"> ${factory.name} </h2>
        <div class="btn-group" role="group">
        <button class="edit-factory btn btn-secondary btn-top">Edit </button>
        <button class="create-children btn btn-primary btn-top">Generate</button>
        </div>
        <h4> Child Count: ${factory.childCount} </h4>
        <ul class="factory-children"> </ul>
        <button class="delete-factory btn btn-danger">Delete </button>
        </div>
`;

const childTemplate = (child) => {
    return `<li>${child}</li>`
}

const createFactory = ( factory ) => {
    $('#factories').append(factoryTemplate(factory))
    const newEl = $(`#${factory._id} .factory-children`)
    factory.children.forEach(num => {
        newEl.append(childTemplate(num))
    })
}