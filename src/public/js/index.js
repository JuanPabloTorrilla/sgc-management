//Agregar campos de acciones al formulario
var indicador = 1;
function addAction() {
    const actionContainer = document.getElementById("container-acciones");
    const actionField = `   <textarea type="text" rows="2" class="form-control" name="accion" placeholder="Accion" required></textarea>
                            <label for="accion">Acción</label>
                            <button id="borrar ${indicador}" class="btn btn-danger delete" type="button" onclick="deleteAction(id)">X</button>
                        `;
    const formAccion = document.createElement('div');
    formAccion.classList.add(indicador,"form-floating","mb-3","d-flex");
    formAccion.innerHTML += actionField;
    actionContainer.appendChild(formAccion);
    indicador++
}

//Borrar los campos de acciones del formulario
function deleteAction(id) {
    const actionContainer = document.getElementById("container-acciones");
    if(actionContainer.childElementCount>1){
        const button = document.getElementById(id);
        button.parentElement.remove();
    };
};
    