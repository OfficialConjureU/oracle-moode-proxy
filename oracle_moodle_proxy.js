const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const qs = require('qs'); // Form-urlencoded serialization

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

app.post('/moodle_direct_post', async (req, res) => {
    try {
        const { wsfunction, users } = req.body;

        if (!wsfunction || !users) {
            return res.status(400).json({ error: 'Missing wsfunction or users payload' });
        }

        const moodleURL = `https://conjureuniversity.online/moodle/webservice/rest/server.php`;

        const postData = {
            wstoken: '519f754c7dc83533788a2dd5872fe991',
            wsfunction: wsfunction,
            moodlewsrestformat: 'json',
        };

        users.forEach((user, index) => {
            for (const key in user) {
                postData[`users[${index}][${key}]`] = user[key];
            }
        });

        const moodleResponse = await axios.post(moodleURL, qs.stringify(postData), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return res.json(moodleResponse.data);

    } catch (error) {
        console.error('Moodle API Error:', error.message);
        return res.status(500).json({ error: 'Failed to post to Moodle.', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Oracle Moodle Proxy running on port ${PORT}`);
});