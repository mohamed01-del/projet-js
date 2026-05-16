const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'tasks.json');

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

const taskModel = {
  getByUser: (userId) => {
    const tasks = readData();
    return tasks.filter(t => t.userId === userId);
  },
  findById: (id) => {
    const tasks = readData();
    return tasks.find(t => t.id === id);
  },
  create: (taskData) => {
    const tasks = readData();
    tasks.push(taskData);
    writeData(tasks);
    return taskData;
  },
  update: (id, partialData) => {
    const tasks = readData();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...partialData, updatedAt: new Date().toISOString() };
      writeData(tasks);
      return tasks[index];
    }
    return null;
  },
  remove: (id) => {
    const tasks = readData();
    const filteredTasks = tasks.filter(t => t.id !== id);
    writeData(filteredTasks);
  }
};

module.exports = taskModel;
