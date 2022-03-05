import server from "./routers/socketRouter";
const PORT = 4000;

server.listen(PORT, () => console.log("running on port " + PORT));
