const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = Buffer.from('FoCKvdLsl7XGottHski1LmyqJHvUhs=', 'base64'); // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;

function encrypt(text) {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + '_' + encrypted.toString('hex');
}

function decrypt(text) {
	let textParts = text.split('_');
	let iv = Buffer.from(textParts.shift(), 'hex');
	let encryptedText = Buffer.from(textParts.join('_'), 'hex');
	let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

let a = encrypt('node-cheat');
let b = decrypt(a);
console.log(a, b);