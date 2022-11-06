const { stdin, stdout, exit } = require('process')
const fs = require('fs');
const path = require('path')
const output = fs.createWriteStream(path.join(__dirname, 'chat.txt')); //создаем файл куда записывать


stdout.write('Hi, I am glad to see you. Tell me something about you?\n'); //вывести в потоке приветственное сообщение
stdin.on('data', (data) => {
    const info = data.toString()
    if (info.trim() === 'exit') {
        stdout.write('How interesting. Thank you for sharing! Bye!')
        exit()
    }
    output.write(data)
})
process.on('SIGINT', () => {
    stdout.write('How interesting. Thank you for sharing! Bye!')
    exit()}
    ); // следить за появн exit и прощальное смс