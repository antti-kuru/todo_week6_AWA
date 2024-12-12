const form = document.getElementById("todoForm")
const nameInput = document.getElementById("userInput")
const todoInput = document.getElementById("todoInput")
const searchForm = document.getElementById("searchForm")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("search")
const todoPerson = document.getElementById("todoPerson")
const todoList = document.getElementById("todoList")


form.addEventListener("submit", async (event) => {
    event.preventDefault()
    let name = nameInput.value
    let todo = todoInput.value

    try{
    const res = await fetch("http://localhost:3000/add", {
        method: "POST",
        headers: { "content-type": "application/json"},
        body: JSON.stringify({name: name, todo: todo})
    })
    const data = await res.json()
    const confirmation = document.createElement("p")
    confirmation.innerHTML = data
    form.appendChild(confirmation)
    setTimeout(() => {
        confirmation.remove()
    }, 3000)
 
    nameInput.value = ""
    todoInput.value = ""
    }catch(error){
        console.log("error occured ", error)
    }

})


// Function to create a todo item
function createTodoItem(name, todo, checked) {
    // creating items
    let listItem = document.createElement("li")
    let itemLabel = document.createElement("label")
    let check = document.createElement("input")
    let span = document.createElement("span")
    let clickableItem = document.createElement("a")

    check.setAttribute("type", "checkbox")
    check.classList.add("checkBoxes")
    check.setAttribute("id", "MyCheckbox")
    check.checked = checked

    // clickable link <a> item for todos 
    
    clickableItem.textContent = `${todo}`
    clickableItem.classList.add("delete-task")

    span.appendChild(clickableItem)
    itemLabel.appendChild(check)
    itemLabel.appendChild(span)

    listItem.appendChild(itemLabel)
    
    todoList.appendChild(listItem)
    console.log(name)

    check.addEventListener("change", async (event) => {
        event.preventDefault()
        console.log("täällä")
        try {
            const req = await fetch("http://localhost:3000/updateTodo", {
                method: "put",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({name: name, checked: check.checked, todo: clickableItem.textContent})
            })
            const updateTodoRes = await req.json()
            console.log("Hereeree")
            const updateMessage = document.createElement("p")
            updateMessage.innerText = updateTodoRes.message
            searchForm.appendChild(updateMessage)
            // Show the message for 3 seconds
            setTimeout(() => {
                updateMessage.remove()
            }, 3000)


        } catch (error) {
            console.log(`${error}`)
        }
    })






    // event listener for deletion
    clickableItem.addEventListener("click", async (event) => {
        console.log("HERE")
        event.preventDefault()
        console.log(name)
        try {
            const todoDeleteData = await fetch("http://localhost:3000/update", {
                method: "put",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({name: name, todo: clickableItem.textContent }),
            })
            const todoDelRes = await todoDeleteData.json()
            console.log("HÄR")
            listItem.remove()
            // Show confirmation message
            const delMsg = document.createElement("p")
            delMsg.innerText = todoDelRes.msg
            searchForm.appendChild(delMsg)
            // Show the message for 3 seconds
            setTimeout(() => {
                delMsg.remove()
            }, 3000)

            // Refetch and update the list after deletion
        } catch (error) {
            console.error(error)
        }
    })
}

// Function to fetch todos
async function fetchTodos(name) {
    try {
        const res = await fetch(`http://localhost:3000/todos/${name}`)
        const data = await res.json()

        todoList.innerHTML = "" // Clear the list

        if (res.status === 404) {
            todoList.innerHTML = `<li>${data.msg}</li>`
        } else {
            todoPerson.innerText = `Todo list for user ${name}`
            data.forEach((object) => createTodoItem(name, object.todo, object.checked))
            if (!document.getElementById("deleteUser")) {
                const deleteBtn = createDeleteButton(name)
                searchForm.appendChild(deleteBtn)
            }
        }
    } catch (error) {
        console.error(error)
    }
}

// Event listener for search button
search.addEventListener("click", (event) => {
    event.preventDefault()
    const name = searchInput.value
    fetchTodos(name)
})

function createDeleteButton(name) {
    const deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("id", "deleteUser")
    deleteBtn.classList.add("btn")
    deleteBtn.innerText = "Delete"

    // Add event listener for deletion
    deleteBtn.addEventListener("click", async (event) => {
        event.preventDefault()
        try {
            const delData = await fetch("http://localhost:3000/delete", {
                method: "delete",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name }),
            })
            const delResponse = await delData.json()

            // Show confirmation message
            const deleteMsg = document.createElement("p")
            deleteMsg.innerText = delResponse.msg
            searchForm.appendChild(deleteMsg)
            setTimeout(() => {
                deleteMsg.remove()
            }, 3000)

            // Clear the UI
            todoPerson.innerText = ""
            searchInput.value = ""
            todoList.innerHTML = ""
            deleteBtn.remove()
        } catch (error) {
            console.error(error)
        }
    })

    return deleteBtn
}
