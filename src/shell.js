        class FileSystem {
            constructor() {
                this.root = {
                    name: '/',
                    type: 'dir',
                    children: {}
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
                .ossssssssssssssssssdMMMNysssso.      OS: WebOS x86_64 (non-LG)
                /ssssssssssshdmmNNmmyNMMMMhssssss/     Host: Eurofighter Tranche 4 DDI2
                +ssssssssshmydMMMMMMMNddddyssssssss+    Kernel: 6.6.7-zen1-1-custom
                /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/   ${this.uptime()}
                .ssssssssdMMMNhsssssssssshNMMMdssssssss.  Packages: 1984 (pacman)
                +sssshhhyNMMNyssssssssssssyNMMMysssssss+  Shell: sbash 0.1.2
                ossyNMMMNyMMhsssssssssssssshmmmhssssssso  Resolution: 7680x4320 (VR Ready)
                ossyNMMMNyMMhsssssssssssssshmmmhssssssso  DE: i3-gaps + RiceMaster5000
                +sssshhhyNMMNyssssssssssssyNMMMysssssss+  WM: none
                .ssssssssdMMMNhsssssssssshNMMMdssssssss.  WM Theme: n/a
                /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/   Terminal: browser
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

        function showGreeting() {
            const greeting = `Sach.si Shell (with no point whatsoever, wtf did u expect, its still sach.si )\nType 'help' to see available commands.\n`;
            const greetingDiv = document.createElement('div');
            greetingDiv.textContent = greeting;
            terminal.insertBefore(greetingDiv, commandInput.parentElement);
        }
        showGreeting();

        function executeCommand(cmd) {
            if (cmd.trim()) {
                commandHistory.push(cmd);
                historyIndex = commandHistory.length;
            }
            const parts = cmd.trim().split(' ');
            let output = '';

            if (parts[0] === 'browser' && parts[1]) {
                const url = parts[1];
                const iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.style.width = '100%';
                iframe.style.height = '500px';
                iframe.style.border = 'none';

                const commandDiv = document.createElement('div');
                commandDiv.innerHTML = `<span>$</span> ${cmd}`;
                terminal.insertBefore(commandDiv, commandInput.parentElement);

                terminal.insertBefore(iframe, commandInput.parentElement);
                terminal.scrollTop = terminal.scrollHeight;
                commandInput.value = '';
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

            const commandDiv = document.createElement('div');
            commandDiv.innerHTML = `<span>$</span> ${cmd}`;
            terminal.insertBefore(commandDiv, commandInput.parentElement);

            if (output) {
                const outputDiv = document.createElement('div');
                outputDiv.textContent = output;
                terminal.insertBefore(outputDiv, commandInput.parentElement);
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
