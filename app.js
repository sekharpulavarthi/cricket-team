const express = require("express");

const { open } = require("sqlite");

const path = require("path");

const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running successfully at port 3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);

    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (req, res) => {
  const getPlayersQuery = `

    SELECT * FROM cricket_team`;

  const getPlayers = await db.all(getPlayersQuery);

  res.send(getPlayers);
});

app.post("/players/", async (req, res) => {
  const playerDetails = req.body;

  const { playerName, jerseyNumber, role } = playerDetails;

  const addBookQuery = `INSERT INTO cricket_team (player_name, jersey_number, role)

  VALUES( '${playerName}', '${jerseyNumber}', '${role}');`;

  const dbResponse = await db.run(addBookQuery);

  const player = dbResponse.lastID;
  res.send({ player });
});

app.put("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const playerDetails = req.body;

  const { playerName, jerseyNumber, role } = playerDetails;

  const addBookQuery = `
  UPDATE 
  cricket_team
   SET 
   player_name='${playerName}', 
   jersey_number=${jerseyNumber},
   role='${role}'
  WHERE 
  player_id = ${playerId};`;

  await db.run(addBookQuery);

  res.send("Book Updated Successfully");
});

app.delete("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;

  const deleteQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId};
    `;

  await db.run(deleteQuery);

  res.send("Book Deleted Successfully");
});
