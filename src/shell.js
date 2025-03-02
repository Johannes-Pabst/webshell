        let name = "Sach.si" //don't forget to change the site title in the html  
        class FileSystem {
            
                constructor() {
                    this.root = {
                        name: '/',
                        type: 'dir',
                        children: {
                            'home': {
                                name: 'home',
                                type: 'dir',
                                children: {
                                    'user': {
                                        name: 'user',
                                        type: 'dir',
                                        children: {
                                            'notes.txt': {
                                                name: 'notes.txt',
                                                type: 'file',
                                                content: 'This is a preloaded file with some text.'
                                            },
                                            'script.py': {
                                                name: 'script.py',
                                                type: 'file',
                                                content: 'print("Hello from script.py")'
                                            }
                                        }
                                    }
                                }
                            },
                            'bin': {
                                name: 'bin',
                                type: 'dir',
                                children: {
                                    'hello.sh': {
                                        name: 'hello.sh',
                                        type: 'file',
                                        content: 'echo "Hello, world!"'
                                    }
                                }
                            }
                        }
                    };
                this.currentDir = this.root;
                this.path = '/';
                this.startTime = Date.now();
            }
            ls() {
                return Object.keys(this.currentDir.children).join(' ') || '(empty directory)';
            }
            mkdir(name) {
                if (!name) return 'Usage: mkdir <directory>';
                if (this.currentDir.children[name]) return 'Directory already exists';
                this.currentDir.children[name] = {
                    name,
                    type: 'dir',
                    children: {}
                };
                return `Directory '${name}' created.`;
            }
            echo(text) {
                return text ? text : 'Usage: echo <text>';
            }
            rm(name, recursive = false) {
                if (!name) return 'Usage: rm <filename|directory>';
                if (!this.currentDir.children[name]) return 'No such file or directory';
                if (this.currentDir.children[name].type === 'dir') {
                    if (!recursive) return 'Cannot remove a directory without -r';
                }
                delete this.currentDir.children[name];
                return `'${name}' removed.`;
            }

            uptime() {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                return `Uptime: ${elapsed} seconds`;
            }
            random(max = 1000) {
                const num = parseInt(max, 10);
                if (isNaN(num) || num <= 0) return 'Usage: random <max> (must be a positive number)';
                return `Random number: ${Math.floor(Math.random() * (num + 1))}`;
            }
            sysinfo() {

    return `
            .-/+oossssoo+/-.
        \`:+ssssssssssssssssss+:\`          sach.si@insane-rig
      -+ssssssssssssssssssyyssss+-        -------------------
    .ossssssssssssssssssdMMMNysssso.      OS: Arch Linux x86_64
   /ssssssssssshdmmNNmmyNMMMMhssssss/     Host: Eurofighter Tranche 4 DDI2
  +ssssssssshmydMMMMMMMNddddyssssssss+    Kernel: 6.6.7-zen1-1-custom
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/   ${this.uptime()}
.ssssssssdMMMNhsssssssssshNMMMdssssssss.  Packages: 1984 (pacman)
+sssshhhyNMMNyssssssssssssyNMMMysssssss+  Shell: zsh 5.9
ossyNMMMNyMMhsssssssssssssshmmmhssssssso  Resolution: 7680x4320 (VR Ready)
ossyNMMMNyMMhsssssssssssssshmmmhssssssso  DE: i3-gaps + RiceMaster5000
+sssshhhyNMMNyssssssssssssyNMMMysssssss+  WM: OpenBox, but in a box
.ssssssssdMMMNhsssssssssshNMMMdssssssss.  WM Theme: CyberMatrixOverkill
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/   Terminal: alacritty (hacked)
  +sssssssssdmydMMMMMMMMddddyssssssss+    CPU: 256-core Quantum AI Processor
   /ssssssssssshdmNNNNmyNMMMMhssssss/     GPU: 4x RTX 9090 Ti UltraVoid
    .ossssssssssssssssssdMMMNysssso.      Memory: 1.5TB DDR6.9 (Overclocked)
      -+sssssssssssssssssyyyssss+-        Storage: 500TB NVMe GenX
        \`:+ssssssssssssssssss+:\`          Power Source: Cold Fusion Reactor
            .-/+oossssoo+/-.              Hidden Feature: 🦄 Secret AI Cluster Online
    `;
}



            ps() {
                return `PID   CMD
                1234  bash
                5678  nano
                9101  node server.js
                1121  python script.py
                6969  virus
                2314  sudo rm -fr /`;
            }
            touch(name) {
                if (!name) return 'Usage: touch <filename>';
                if (this.currentDir.children[name]) return 'File already exists';
                this.currentDir.children[name] = {
                    name,
                    type: 'file',
                    content: ''
                };
                return `File '${name}' created.`;
            }
            nano(name) {
                if (!name) return 'Usage: nano <filename>';
                if (!this.currentDir.children[name]) return 'File not found';
                nanoEditor.value = this.currentDir.children[name].content;
                nanoEditor.style.display = 'block';
                nanoEditor.focus();
                nanoEditor.setAttribute('data-file', name);
                return `Editing '${name}' (Press ESC to save & exit)`;
            }
            saveNano() {
                const name = nanoEditor.getAttribute('data-file');
                if (name && this.currentDir.children[name]) {
                    this.currentDir.children[name].content = nanoEditor.value;
                }
                nanoEditor.style.display = 'none';
                nanoEditor.removeAttribute('data-file');
                commandInput.focus();

                const outputDiv = document.createElement('div');
                outputDiv.textContent = `File '${name}' saved.`;
                terminal.insertBefore(outputDiv, commandInput.parentElement);
                terminal.scrollTop = terminal.scrollHeight;
            }
            pwd() {
                return this.path;
            }

            cat(name) {
                if (!name) return 'Usage: cat <filename>';
                if (!this.currentDir.children[name] || this.currentDir.children[name].type !== 'file') return 'File not found';
                return this.currentDir.children[name].content || '(empty file)';
            }
            cd(name) {
                if (!name) return 'Usage: cd <directory>';
                if (name === '..') {
                    if (this.path === '/') return 'Already at root';
                    this.path = this.path.split('/').slice(0, -2).join('/') + '/';
                    this.currentDir = this.root;
                    this.path.split('/').filter(p => p).forEach(p => this.currentDir = this.currentDir.children[p]);
                    return `Moved to '${this.path || '/'}'`;
                }
                if (!this.currentDir.children[name] || this.currentDir.children[name].type !== 'dir') return 'No such directory';
                this.currentDir = this.currentDir.children[name];
                this.path += name + '/';
                return `Moved to '${this.path}'`;
            }
            tree(node = this.currentDir, prefix = '') {
                let output = `${prefix}${node.name}/\n`;
                for (const key in node.children) {
                    const child = node.children[key];
                    output += this.tree(child, prefix + '  ');
                }
                return output;
            }
            help() {
                return `Available commands:
                ls - List directory contents
                pwd - Show current path
                mkdir <directory> - Create a new directory
                touch <filename> - Create a new file
                nano <filename> - Edit a file
                cat <filename> - View file contents
                cd <directory> - Change directory
                tree - Display directory structure
                clear - Clear the terminal
                browser <URL> - opens an iframe displaying a website
                uptime - displays the current uptime in seconds
                random [max] - generates a random number between 0 and max
                ps - displays the current processes
                help - Display this help message
                neofetch - displays system information
                exit - Close the session`;
            }
        }

        const fs = new FileSystem();
        const terminal = document.getElementById('terminal');
        const commandInput = document.getElementById('command');
        const nanoEditor = document.getElementById('nano-editor');
        let commandHistory = [];
        let historyIndex = -1;
        let pyodide = null; // Pyodide instance
        let pyodideReady = false; // Track if Pyodide is loaded
        function showGreeting() {
            const greeting = `${name} Shell (with no point whatsoever, wtf did u expect, its still ${name} )\nType 'help' to see available commands.\n`;
            const greetingDiv = document.createElement('div');
            greetingDiv.textContent = greeting;
            terminal.insertBefore(greetingDiv, commandInput.parentElement);
        }
        function displayOutput(text) {
            const outputDiv = document.createElement('div');
            outputDiv.textContent = text;
            outputDiv.style.whiteSpace = "pre-wrap"; // Ensure newlines are preserved
            terminal.insertBefore(outputDiv, commandInput.parentElement);
            terminal.scrollTop = terminal.scrollHeight;
        }
        
        
        showGreeting();
        async function loadPyodideInstance() {
            const loadingMessage = document.createElement('div');
            loadingMessage.textContent = "Loading Python...";
            terminal.insertBefore(loadingMessage, commandInput.parentElement);
            terminal.scrollTop = terminal.scrollHeight;
        
            try {
                pyodide = await globalThis.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/" });
                pyodideReady = true;
                loadingMessage.textContent = "Python loaded! You can now run scripts.";
            } catch (e) {
                loadingMessage.textContent = `Failed to load Python: ${e.message}`;
            }
        
            terminal.scrollTop = terminal.scrollHeight;
        }
        async function runPython(code) {
            if (!pyodideReady) {
                await loadPyodideInstance();
            }
        
            try {
                globalThis.__output = [];  // Ensure output storage exists
        
                function showOutput() {
                    let outputDiv = document.getElementById("python-output");
                    if (outputDiv) {
                        outputDiv.innerHTML = globalThis.__output.join("<br>");
                    }
                }
        
                globalThis.capturePythonOutput = function (text) {
                    globalThis.__output.push(text);
                    showOutput();
                };
        
                // Redirect Python stdout/stderr
                await pyodide.runPythonAsync(`
                    import sys
                    from js import globalThis
                    
                    class StdoutRedirect:
                        def write(self, text):
                            if text.strip():
                                globalThis.capturePythonOutput(text)
        
                        def flush(self):
                            pass
                    
                    sys.stdout = StdoutRedirect()
                    sys.stderr = sys.stdout
                `);
        
                // Check if code is a filename and read it from the virtual filesystem
                if (fs.currentDir.children[code] && fs.currentDir.children[code].type === 'file') {
                    const fileContent = fs.currentDir.children[code].content; // Get file contents
                    await pyodide.FS.writeFile("/" + code, fileContent); // Save it to Pyodide FS
                    code = `exec(open("/${code}").read())`; // Modify code to execute the file
                }
        
                await pyodide.runPythonAsync(code);
                const outputText = globalThis.__output.join("\n");
                displayOutput(outputText || "");
        
            } catch (e) {
                displayOutput(`Python Error: ${e}`);
            }
        }
        
        
        
        
        
        async function executeCommand(cmd) {
            if (cmd.trim()) {
                commandHistory.push(cmd);
                historyIndex = commandHistory.length;
            }
            const parts = cmd.trim().split(' ');
        
            // Display the command itself before processing it
            const commandDiv = document.createElement('div');
            commandDiv.innerHTML = `<span>$</span> ${cmd}`;
            terminal.insertBefore(commandDiv, commandInput.parentElement);
            
            let output = '';
        
            if (parts[0] === 'python') {
                const code = cmd.slice(7);  // Extract everything after "python "
                await runPython(code);  // Ensure this runs properly
                return;
            }
        
            switch (parts[0]) {
                case 'ls':
                    output = fs.ls();
                    break;
                case 'mkdir':
                    output = fs.mkdir(parts[1]);
                    break;
                case 'touch':
                    output = fs.touch(parts[1]);
                    break;
                case 'nano':
                    output = fs.nano(parts[1]);
                    break;
                case 'cat':
                    output = fs.cat(parts[1]);
                    break;
                case 'cd':
                    output = fs.cd(parts[1]);
                    break;
                case 'tree':
                    output = fs.tree();
                    break;
                case 'help':
                    output = fs.help();
                    break;
                case 'neofetch':
                    output = fs.sysinfo();
                    break;
                case 'rm':
                    output = parts[1] === '-r' ? fs.rm(parts[2], true) : fs.rm(parts[1]);
                    break;
                case 'clear':
                    location.reload();
                    return;
                case 'exit':
                    output = 'Session closed';
                    commandInput.disabled = true;
                    return;
                case 'pwd':
                    output = fs.pwd();
                    break;
                case 'echo':
                    output = fs.echo(parts.slice(1).join(' '));
                    break;
                case 'uptime':
                    output = fs.uptime();
                    break;
                case 'random':
                    output = fs.random(parts[1]);
                    break;
                case 'ps':
                    output = fs.ps();
                    break;
                default:
                    output = 'Command not found';
            }
        
            if (output) {
                displayOutput(output);
            }
        
            commandInput.value = '';
            terminal.scrollTop = terminal.scrollHeight;
        }
        
        


        nanoEditor.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                fs.saveNano();
            }
        });


        commandInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                executeCommand(commandInput.value);
            } else if (event.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    commandInput.value = commandHistory[historyIndex];
                }
                event.preventDefault(); // Prevent moving the cursor to the start
            } else if (event.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    commandInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    commandInput.value = '';
                }
                event.preventDefault(); // Prevent moving the cursor to the end
            }
        });
