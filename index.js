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
                if (parts.length === 3){
                    comments.push({
                    text: parts[2],
                    isImportant : isImportant, 
                    author: parts[0], 
                    data : parts[1],
                })} else {
                    comments.push({
                    text: commentText,
                    isImportant : isImportant, 
                    author: NaN, 
                    data : NaN,
                });
                }
                
            }
        }
    }
    return comments;
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
            for (const line of lines){
                console.log(line.text)
            }
            break;

        case 'important':
            for (const line of lines){
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
            for (const line of userTodos){
                console.log(line.text)
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

