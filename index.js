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
                const isImportant = commentText.includes('!');
                comments.push({
                    text: commentText,
                    isImportant : isImportant
                });
            }
        }
    }
    return comments;
}

function processCommand(command) {
    const lines = getComments()
    switch (command) {
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
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
