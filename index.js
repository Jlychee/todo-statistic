const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments() {
    const comments = [];
    for (const content of files) {
        const lines = content.split('\n');
        for (const line of lines) {
            const match = line.match(/\/\/\s*TODO\s*(.*)/);
            if (match) {

                const commentText = match[1];
                const parts = commentText.split(';')
                const isImportant = commentText.includes('!');

                const [author, data, text] = parts;
                const finalText = parts.length === 3 ? text : commentText

                comments.push({
                    text: finalText,
                    isImportant,
                    author: parts.length === 3 ? author : NaN,
                    data: parts.length === 3 ? data : NaN,
                    importance: (finalText.match(/!/g) || []).length
                });
            }
        }
    }

    return comments;
}

function sortComments(comments, sortType) {
    switch (sortType) {
        case 'importance':
            comments.sort((a, b) => b.importance - a.importance)
                .forEach(c => console.log(c.text));
            break;

        case 'user':
            comments
                .sort((a, b) => {
                    if (!a.author) return 1;
                    if (!b.author) return -1;
                    return a.author.localeCompare(b.author);
                })
                .forEach(c => console.log(c.text));
            break;

        case 'date':
            comments
                .sort((a, b) => {
                    if (!a.data) return 1;
                    if (!b.data) return -1;
                    return new Date(b.data) - new Date(a.data);
                })
                .forEach(c => console.log(c.text));
            break;

    }
}

function processCommand(command) {
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const lines = getComments()
    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const line of lines) {
                console.log(line.text)
            }
            break;

        case 'important':
            for (const line of lines) {
                if (line.isImportant) {
                    console.log(line.text);
                }
            }
            break;

        case 'user':
            if (parts.length < 2) {
                console.log('Please specify username');
                break;
            }
            const username = parts[1].toLowerCase();
            const userTodos = lines.filter(todo =>
                todo.author && todo.author.toLowerCase() === username
            );
            for (const line of userTodos) {
                console.log(line.text)
            }
            break;

        case 'sort':
            sortComments(lines, parts[1]);
            break;

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

