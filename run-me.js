
const username = ['SUDO_USER', 'LOGNAME', 'USER', 'LNAME', 'USERNAME']
    .map(k => process.env[k])
    .find(k => k);

console.log(`Hello ${username || 'you'}`);
