"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("./models/User");
/*
type TUser = {
    name: string,
    todos: string[]
}

let users : TUser[] = []


*/
const router = (0, express_1.Router)();
/*
if (fs.existsSync("data.json")) {

    fs.readFile("data.json", "utf8", (err: NodeJS.ErrnoException | null, data: string) => {
        if (err) {
            console.error(err)
            return
        }
        try {
            users = JSON.parse(data)
        } catch (error: any) {
            console.error(`Error parsing JSON: ${error}`)
        }
    })

}

*/
router.put("/updateTodo", async (req, res) => {
    try {
        const user = await User_1.User.findOne({ name: req.body.name });
        if (user) {
            const todoIndex = user.todos.findIndex(todo => todo.todo === req.body.todo);
            if (todoIndex != -1) {
                user.todos[todoIndex].checked = req.body.checked;
                await user.save();
                res.status(200).json({ message: "Todo updated successfully" });
            }
        }
        else {
            res.status(404).json({ message: "error" });
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
});
router.post("/add", async (req, res) => {
    try {
        const existingUser = await User_1.User.findOne({ name: req.body.name });
        if (existingUser) {
            existingUser.todos.push({ todo: req.body.todo, checked: false });
            existingUser.save();
        }
        else {
            const user = new User_1.User({
                name: req.body.name,
                todos: [{ todo: req.body.todo, checked: false }]
            });
            await user.save();
            console.log("User saved");
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
    /*



    const {name, todo} = req.body
    let found: boolean = false

    for (let i: number = 0; i < users.length; i++) {
        console.log("name that is searched is: " + name)
        if (users[i].name === name){
            console.log("found")
            users[i].todos.push(todo)
            found = true
            break
        }
    }

    if (!found) {
        console.log("User not found, adding new user.");
        const newUser: TUser = { name: name, todos: [todo] };
        users.push(newUser);
    }

    console.log("Updated users:", users);


    fs.writeFile("data.json", JSON.stringify(users), (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log(err)
            return
        }
        res.json(`Todo added successfully for user ${name}`)
    })  */
});
router.get("/todos/:id", async (req, res) => {
    try {
        const searchedUser = await User_1.User.findOne({ name: req.params.id });
        if (searchedUser) {
            res.json(searchedUser.todos);
        }
        else {
            res.status(404).json({ msg: "User not found" });
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
    /*
    const id: string = req.params.id
    const user = users.find((user) => user.name === id)

    if (user) {
        res.json(user.todos)
    } else {
        res.status(404).json({ msg: "User not found" })
    } */
});
/*



router.delete("/delete", (req: Request, res: Response) => {
    const {name} = req.body
    // Get the correct index of the user that we want to delete
    const userIndex = users.findIndex(user => user.name === name)
    // If the user is found
    if (userIndex !== -1) {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        users.splice(userIndex, 1)
        fs.writeFile("data.json", JSON.stringify(users), (err: NodeJS.ErrnoException | null) => {
            if (err) {
                console.log(err)
                return
            }
            res.json({ msg: `User deleted successfully`})
        })
    } else {
        res.status(404).json({ msg: "User not found" })
    }

})

*/
router.put("/update", async (req, res) => {
    try {
        console.log("olenko");
        console.log(req.body);
        const user = await User_1.User.findOne({ name: req.body.name });
        console.log(user);
        if (user) {
            const todoIndex = user.todos.findIndex((item) => item.todo === req.body.todo);
            console.log(todoIndex);
            if (todoIndex !== -1) {
                user.todos.splice(todoIndex, 1);
                await user.save();
                res.json({ msg: `Todo ${req.body.todo} deleted succesfully` });
            }
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
});
exports.default = router;
