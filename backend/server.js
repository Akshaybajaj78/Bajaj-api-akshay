const express = require('express');
const cors = require('cors');
const { processHierarchies } = require('./utils/graphProcessor');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid payload format. Expected { 'data': [...] }" });
        }

        const result = processHierarchies(data);
        
        // Return the required response structure
        return res.status(200).json({
            user_id: "Akshaybajaj_11012006",
            email_id: "akshay0017.be23@chitkara.edu.in",
            college_roll_number: "2310990017",
            hierarchies: result.hierarchies,
            invalid_entries: result.invalid_entries,
            duplicate_edges: result.duplicate_edges,
            summary: result.summary
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});
