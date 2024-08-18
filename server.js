const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3001;

app.use(express.json());

app.post('/run-command', (req, res) => {
    const { commandType, command } = req.body;

    // Ensure commandType is valid
    if (commandType !== 'qemu' && commandType !== 'vbox') {
        res.status(400).json({ output: 'Invalid command type' });
        return;
    }

    // Construct the full command
    const fullCommand = (commandType === 'qemu' ? 'qemu-system-x86_64 ' : 'VBoxManage ') + command;

    exec(fullCommand, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ output: `Error: ${error.message}` });
            return;
        }
        if (stderr) {
            res.status(500).json({ output: `stderr: ${stderr}` });
            return;
        }
        res.json({ output: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
