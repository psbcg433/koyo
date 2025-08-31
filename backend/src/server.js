import app from "./app.js";


const PORT = process.env.PORT || 5000;

async function startServer(port) {

    await app.listen(port, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


startServer(PORT);