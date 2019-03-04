const bcrypt = require('bcrypt')
export class MyBcrypt {
  static async encryptPassword(passString, rounds) {
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(passString, salt);
  }
  static async comparePassword(newPass, hash) {
    return await bcrypt.compare(newPass, hash);
  }
}