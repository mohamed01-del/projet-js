const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

const readData = () => {
  if (!fs.existsSync(dataPath)) {
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataPath, '[]');
  }
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

const userModel = {
  findByEmail: (email) => {
    const users = readData();
    return users.find(u => u.email === email);
  },
  create: (userData) => {
    const users = readData();
    users.push(userData);
    writeData(users);
    return userData;
  }
};

module.exports = userModel;
