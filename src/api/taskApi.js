import {get} from './common/axios'

const GET_ALL_TASK_URL = "/task/all";
const GET_UNFINISHED_TASK_URL = "/task/todo";

//获取所有任务
export const getAllTask = () => {
    return get(GET_ALL_TASK_URL);
}

//获取未完成的任务
export const getTodoTask = () => {
    return get(GET_UNFINISHED_TASK_URL);
}

//增加任务
export const addTask = (task) => {
    console.log(task)
    //todo
}

//删除任务
export const deleteTask = (task) => {
    console.log(task)
    //todo
}

//更新任务
export const updateTask = (task) => {
    console.log(task)
    //todo
}

//增加任务步骤
export const addStep = (taskStep) => {
    console.log(taskStep)
    //todo
}

//删除任务步骤
export const deleteStep = (taskStep) => {
    console.log(taskStep)
    //todo
}

//变更任务步骤
export const updateStep = (taskStep) => {
    console.log(taskStep)
    //todo
}
