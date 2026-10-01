require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const BIN_ID = "6abc8c39ac6210605a041394";

const PORT = process.env.PORT || 3000;

/*
Serve the Smart Choice website files
from the parent folder.
*/

app.use(express.static(path.join(__dirname, "..")));
app.get("/api/posts", async (req, res) => {

    try {

        const response = await fetch(
            `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
            {
                headers: {
                    "X-Master-Key": process.env.JSONBIN_MASTER_KEY
                }
            }
        );

        if (!response.ok) {

            const errorText = await response.text();

            return res.status(response.status).json({
                error: "JSONBin request failed",
                details: errorText
            });

        }

        const data = await response.json();

        res.json({
            posts: Array.isArray(data.record)
                ? data.record
                : []
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server could not load posts."
        });

    }

});
app.listen(PORT, () => {

    console.log(
        `Smart Choice server running on port ${PORT}`
    );

});