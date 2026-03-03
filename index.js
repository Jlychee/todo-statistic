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
                comments.push(match[1]);
            }
        }


    }
    console.log(comments)
    return comments;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            getComments();
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
