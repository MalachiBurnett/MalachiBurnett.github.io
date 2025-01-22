const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const input = document.getElementById('input');
const prompt = document.getElementById('prompt');

writeOutput("Hi, I'm Malachi Burnett. Welcome to my portfolio. Use \"help\" to see available commands.");

terminal.addEventListener('click', (e) => {
    // Ensure the input stays focused when clicking anywhere on the terminal
    if (e.target !== input) {
        input.focus();
    }
});

let currentPath = '/';
const fileSystem = {
    '/': {
        type: 'dir',
        contents: {
            'github.exe': { type: 'link', url: 'https://github.com/MalachiBurnett', extra: 'Explore my repositories and projects.', mode: 'link'},   
            projects: {
                type: 'dir',
                contents: {
                    'fanta-c.exe': {type: 'link', url:'https://github.com/MalachiBurnett/Fanta-C', extra: 'A simple interpreter for a custom programming language I created.', mode: 'link'},
                    'logic-gate-cpu.exe': {type: 'link', url:'https://github.com/MalachiBurnett/Logic-Gate-CPU', extra: 'A CPU designed using logic gates, complete with a custom IDE made with Python and the Tkinter library. It supports 16 instructions.', mode: 'link'},
                },
            },
            work: {
                type: 'dir',
                contents: {
                    'excape.exe': { type: 'link', url: 'https://excape.co.uk', extra: 'I work at Exmouth Escape Rooms creating and programming puzzles using microcontrollers and Arduino IDE (C++).', mode: 'iframe' },
                },
            },
            education: {
                type: 'dir',
                contents: {
                    'qualifications.txt': { type: 'file', content: 'I have a C++ Certificate from W3Schools. Despite being in secondary school, I am a competent programmer.' },
                    'schools.txt': { type: 'file', content: 'I currently attend South Devon UTC, studying AQA GCSE Computer Science, Cambridge Nationals Creative iMedia, and Cambridge Nationals IT.' },
                    'cppcertificate.exe': { type: 'link', url: 'https://verify.w3schools.com/1OGKRJMM03', mode: 'iframe', extra: 'I earned this certificate for C++ programming at 13 years old.'},
                },
            },
        },
    },
};

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value.trim();
        input.value = '';
        handleCommand(command);
        prompt.innerHTML = `@portfolio${currentPath} $`;
    }
});

function handleCommand(command) {
    if (command === '') return;
    writeOutput(`<span class="prompt">@portfolio${currentPath} $</span>${command}`);
    const [cmd, ...args] = command.split(' ');
    switch (cmd) {
        case 'help':
            writeOutput(
                'Available commands:\n' +
                'help - Show this help message\n' +
                'clear - Clear the terminal\n' +
                'ls - List directory contents\n' +
                'cd [folder] - Change directory (use cd ../ to go back)\n' +
                'view [file] - View a text file\n' +
                './[program].exe - Execute a program in the current directory'
            );
            break;
        case 'clear':
            output.innerHTML = '';
            break;
        case 'ls':
            listDirectory();
            break;
        case 'cd':
            changeDirectory(args[0]);
            break;
        case 'view':
            viewOrEditFile(args[0]);
            break;
        case './github.exe':
        case './fanta-c.exe':
        case './logic-gate-cpu.exe':
        case './excape.exe':
        case './cppcertificate.exe':
            executeLink(cmd.slice(2));
            break;
        default:
            writeOutput(`Unknown command: ${command}`);
    }
}

function writeOutput(text) {
    output.innerHTML += `${text}\n`;
    terminal.scrollTop = terminal.scrollHeight;
}

function getCurrentDirectory() {
    const pathSegments = currentPath.split('/').filter(Boolean);
    let currentDir = fileSystem['/'];
    for (const segment of pathSegments) {
        currentDir = currentDir.contents[segment];
    }
    return currentDir;
}

function listDirectory() {
    const dir = getCurrentDirectory();
    if (dir.type !== 'dir') {
        writeOutput('Not a directory');
        return;
    }
    const contents = dir.contents;
    for (let i in contents) {
        if (contents[i].type === 'dir') {
            if (i.length < 6) {
                writeOutput(`${i}\t\t-\tfolder`);
            } else {
                writeOutput(`${i}\t-\tfolder`);
            }
        } else if (contents[i].type === 'file') {
            writeOutput(`${i}\t-\tfile`);
        } else if (contents[i].type === 'link') {
            writeOutput(`${i}\t-\tprogram`);
        }
    }
}

function changeDirectory(folder) {
    const dir = getCurrentDirectory();
    if (!folder) {
        writeOutput('Specify a directory.');
        return;
    }

    if (folder === '..' || folder === '../') {
        // Navigate up one level
        if (currentPath !== '/') {
            currentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
        }
    } else if (dir.contents[folder] && dir.contents[folder].type === 'dir') {
        // Navigate into the specified folder
        currentPath += currentPath === '/' ? folder : `/${folder}`;
    } else {
        writeOutput(`No such directory: ${folder}`);
    }
}

function viewOrEditFile(fileName) {
    const dir = getCurrentDirectory();
    if (!fileName) {
        writeOutput('Specify a file name.');
        return;
    }
    if (dir.contents[fileName]) {
        if (dir.contents[fileName].type === 'file') {
            writeOutput(`File content of ${fileName}:\n${dir.contents[fileName].content}`);
        } else {
            writeOutput(`${fileName} is not a file.`);
        }
    } else {
        writeOutput(`No such file: ${fileName}`);
    }
}

function executeLink(name) {
    const dir = getCurrentDirectory();
    if (dir.contents[name] && dir.contents[name].type === 'link') {
        writeOutput(`Opening ${dir.contents[name].url}`);
        if(dir.contents[name].mode === 'iframe') {
            writeOutput(`<iframe src=\"${dir.contents[name].url}\" width=800rem height=300rem>`);
        } else {
            window.open(dir.contents[name].url);
        }
        writeOutput(dir.contents[name].extra);
    } else {
        writeOutput(`${name} is not an executable link.`);
    }
}