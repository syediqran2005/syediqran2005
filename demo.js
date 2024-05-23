const queryString = require('querystring')
const http = require('http')
const path = require('path')
const fs = require('fs')

const PORT = 3002
const filePath = path.join(process.cwd(), 'data.json')

const handleHomeRoute = (res) => {
    res.write("HOME ROUTE");
    res.end();
};

const handleSignupRoute = (res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
        <form action='/submit-signup' method="POST">
            <input type="text" name="username" placeholder="Enter Username" required/>
            <input type="password" name="password" placeholder="Enter Password" required/>
            <input type="tel" name="phoneNumber" placeholder="Enter Phone number" required/>
            <input type="email" name="email" placeholder="Enter Email address" required/>
            <button type="submit">SIGN UP</button>
        </form>
    `);
    res.end();
};

const handleLoginRoute = (res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
        <form action='/submit-login' method="POST">
            <input type="text" name="username" placeholder="Enter Username" required/>
            <input type="password" name="password" placeholder="Enter Password" required/>
            <button type="submit">LOGIN</button>
        </form>
    `);
    res.end();
};

const handleSubmitSignup = (req, res) => {
    let data = "";
    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', () => {
        const parsedData = queryString.parse(data);
        const users = readUsersFromFile();

        users.push(parsedData);

        fs.writeFile(filePath, JSON.stringify(users), (err) => {
            if (err) {
                res.writeHead(500);
                console.log("Error writing file", err);
                res.write("Internal Server Error");
            } else {
                res.write("SIGNUP SUCCESSFUL");
            }
            res.end();
        });
    });
};

const handleSubmitLogin = (req, res) => {
    let data = "";
    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', () => {
        const parsedData = queryString.parse(data);
        const users = readUsersFromFile();

        if (!Array.isArray(users)) {
            console.log("Error: Users is not an array", users);
            res.writeHead(500);
            res.end("Internal Server Error");
            return;
        }

        const user = users.find(user => user.username === parsedData.username && user.password === parsedData.password);
        if (user) {
            res.writeHead(200);
            res.end("LOGIN SUCCESSFUL");
        } else {
            res.writeHead(401);
            res.end("INVALID USERNAME OR PASSWORD");
        }
        res.end();
    });
};

const readUsersFromFile = () => {
    try {
        if (!fs.existsSync(filePath)) {
            console.log("File does not exist, returning empty array.");
            return [];
        }
        const fileData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.log("Error reading or parsing file", error);
        return [];
    }
};

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        handleHomeRoute(res);
    } else if (req.url === '/signup') {
        handleSignupRoute(res);
    } else if (req.url === '/login') {
        handleLoginRoute(res);
    } else if (req.url === '/submit-signup') {
        handleSubmitSignup(req, res);
    } else if (req.url === '/submit-login') {
        handleSubmitLogin(req, res);
    } else {
        res.writeHead(404);
        res.write("INVALID ROUTE");
        res.end();
    }
});


server.listen(PORT, ()=>{
    console.log(`Server up and running on port ${PORT}`)
})


















// {
//     "users": [
//         {
//             "username": "raja",
//             "password": "1234"
//         },
//         {
//             "username" : "syediqran",
//             "password" : "123456"
//         }
//     ]
// }




    // const server = http.createServer((req , res) =>{
    //     if(req.url === '/'){
    //         res.write("HOME ROUTE")
    //         res.end()
    //         return
    //     }
        
    //     if(req.url === '/signup') {
    //         res.setHeader('Content-Type', 'text/html')
    //         res.write(`<form action='/submit' method="POST">
    //         <input type="text" name="username" placeholder="Enter Username" />
    //         <input type="number" name="password" placeholder="Enter Password" />
    //         <input type="number" name="phoneNumber" placeholder="Enter Phone number" />
    //         <input type="email" name="email" placeholder="Enter Email address" />
    //         <button>SIGN UP</button>
    //         </form>`)
    //         res.end()
    //         return
    //     }
    
    //     if (req.url === '/login') {
    //         res.setHeader('Content-Type', 'text/html')
    //         res.write(`<form action='/submit' method="POST">
    //         <input type="text" name="username" placeholder="Enter Username" />
    //         <input type="text" name="password" placeholder="Enter Password" />
    //         <button>SUBMIT</button>
    //         </form>`)
    //         res.end()
    //         return
    //     }
    
    //     if(req.url === '/submit'){
    //         let data = ""
    //         req.on('data', (chunk)=>{
    //            data += chunk
    //         })
    
    //         req.on('end', ()=>{
    //             const parsedData = queryString.parse(data)
    //             const userData = JSON.stringify(parsedData)
    //             fs.readFile(filePath, (err,data)=>{
    //                 if (err) {
    //                     console.log("error reading file", err)
    //                 }
    //                 else{
    //                     console.log("Data", data, "Parsed Data ", userData);
    //                 }
    //             })
    //             res.write("SUCCESS")
    //             res.end()
    //         })
    //         return
    //     }
    
    //     res.write("INVALIDE ROUTE")
    //     res.end()
    
    // })