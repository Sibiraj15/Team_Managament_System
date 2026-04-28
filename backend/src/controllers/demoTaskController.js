import { asyncHandler } from "../utils/asyncHandler.js";

let demoTasks = [];

export const getDemoTasks = asyncHandler(async (req, res) => {
  res.json({
    items: demoTasks
  });
});

export const createDemoTask = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("title is required");
  }

  const task = {
    id: `task-${Date.now()}`,
    title,
    status: "open"
  };

  demoTasks = [task, ...demoTasks];
  res.status(201).json(task);
});

export const updateDemoTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, status } = req.body;

  const taskIndex = demoTasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    res.status(404);
    throw new Error("Task not found");
  }

  demoTasks[taskIndex] = {
    ...demoTasks[taskIndex],
    title: title ?? demoTasks[taskIndex].title,
    status: status ?? demoTasks[taskIndex].status
  };

  res.json(demoTasks[taskIndex]);
});

export const deleteDemoTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const taskExists = demoTasks.some((task) => task.id === taskId);

  if (!taskExists) {
    res.status(404);
    throw new Error("Task not found");
  }

  demoTasks = demoTasks.filter((task) => task.id !== taskId);
  res.json({ message: "Task deleted successfully" });
});
