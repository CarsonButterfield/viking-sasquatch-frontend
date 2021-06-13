//adds a factory element to the appropriate div 


const factoryTemplate = (factory) => `
    <div id=${factory._id} class="factory">
        <h2> ${factory.name} </h2>
        <button class="delete-factory">Delete </button>
        <button class="create-children">Generate Numbers </button>
        <h4> Child Count: ${factory.childCount} <h4>
        <ul class="factory-children"> </ul>
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