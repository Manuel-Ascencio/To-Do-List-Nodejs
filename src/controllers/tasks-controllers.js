const { Task } = require("../models/task-model");

const { filterObj } = require("../util/filterObj");
const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.findAll({
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: { tasks },
  });
});

exports.getTaskById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findOne({
    where: { status: "active", id },
  });

  if (!task) {
    return next(new AppError(404, "Not task found"));
  }

  res.status(200).json({
    status: "success",
    data: { task },
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description, completed } = req.body;

  if (!title || !description) {
    return next(new AppError(400, "Must provide title, description"));
  }

  const newTask = await Task.create({
    title,
    description,
    completed,
  });

  res.status(200).json({
    status: "success",
    data: { newTask },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const data = filterObj(req.body, "title", "description", "completed");

  const task = await Task.findOne({ where: { id, status: "active" } });

  await task.update({ ...data });

  res.status(204).json({ status: "success" });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findOne({ where: { id, status: "active" } });

  await task.update({ status: "removed" });

  res.status(204).json({ status: "success" });
});
