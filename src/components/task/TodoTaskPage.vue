<template>
  <div v-loading="loading">

    <!-- 导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>待办事项</el-breadcrumb-item>
      <el-breadcrumb-item>我的一天</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 创建任务按钮 --> 
    <!-- preAddTask：显示创建任务界面 -->
    <el-button type="primary" circle icon="el-icon-plus" id="font-size-24" @click="preAddTask"></el-button>

    <!-- 创建任务界面 -->
    <el-dialog title="创建一个待办事项" :visible.sync="isAddTaskDialogOpen" :before-close="handleAddTaskDialogClose">
      <el-form :model="addTaskForm" label-width="80px">
        <el-form-item label="任务内容">
          <el-input v-model="addTaskForm.content" placeholder="输入任务内容"></el-input>
        </el-form-item>
        <el-form-item label="完成时间">
          <el-date-picker v-model="addTaskForm.deadlineTime" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions" suffix-icon="el-icon-date" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- doAddTask：确定创建任务 -->
          <el-button type="primary" @click="doAddTask">确认</el-button>
          <!-- resetAddTask：重置当前任务数据 -->
          <el-button @click="resetAddTask">重置</el-button>
          <!-- cancleAddTask：取消创建任务 -->
          <el-button @click="cancleAddTask">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 任务卡片 -->
    <!-- doDeleteTask：确认删除任务 preUpdateTask：显示更新任务界面  -->  
    <!-- doAddStep：确认创建任务步骤 doDeleteStep：确认删除任务步骤 doUpdateStepStatus：确认更新任务步骤 -->
    <TaskCard v-for="task in tasks" :key="task.id" :task="task" 
      @delete-task="doDeleteTask" @pre-update-task="preUpdateTask" 
      @add-step="doAddStep" @delete-step="doDeleteStep" @update-step="doUpdateStep">
    </TaskCard>

    <!-- 更新任务界面 -->
    <el-drawer title="待办事项内容变更" :visible.sync="isUpdateTaskDrawerOpen" :before-close="handleUpdateTaskDrawerClose">
      <el-form :model="updateTaskForm" id="update-task-form">
        <el-form-item>
          <el-input v-model="updateTaskForm.content" class="margin-4-10 font-size-18"></el-input>
        </el-form-item>
        <el-form-item>
          <p v-for="taskStep in updateTaskForm.taskSteps" :key="taskStep.id">
            <el-input v-model="taskStep.content" class="margin-4-10"></el-input>
          </p>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="updateTaskForm.deadlineTime" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions" suffix-icon="el-icon-date" value-format="yyyy-MM-dd HH:mm:ss" class="margin-4-10"></el-date-picker>
        </el-form-item>
        <!-- doUpdateTask：确认更新任务 -->
        <el-button @click="doUpdateTask" type="primary" class="margin-4-10">确认</el-button>
        <!-- cancleUpdateTask：取消更新任务 -->
        <el-button @click="cancleUpdateTask" class="margin-4-10">取消</el-button>
        <el-form-item></el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  getTodoTask,
  addTask,
  deleteTask,
  updateTask,
  addStep,
  deleteStep,
  updateStep,
} from "@/api/taskApi";

import TaskCard from "./item/TaskCard";

export default {
  name: "TodoTask",
  data: function () {
    return {
      tasks: [],
      loading: true,
      isAddTaskDialogOpen: false,
      isUpdateTaskDrawerOpen: false,
      addTaskForm: {
        content: "",
        deadlineTime: "",
      },
      updateTaskForm: {
        id: "",
        status: "",
        content: "",
        createTime: "",
        deadlineTime: "",
        taskSteps: [],
      },
      changedTask: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const now = new Date();
              var date = new Date( now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 23:59:59" );
              picker.$emit("pick", date);
            },
          },
          {
            text: "明天",
            onClick(picker) {
              const now = new Date();
              var date = new Date( now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 23:59:59" );
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周后",
            onClick(picker) {
              const now = new Date();
              var date = new Date( now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 23:59:59" );
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  components: { TaskCard },
  methods: {
    // 增加任务
    preAddTask() {
      this.isAddTaskDialogOpen = true;
    },
    handleAddTaskDialogClose() {
      this.isAddTaskDialogOpen = false;
    },
    doAddTask() {
      var task = {};
      task.content = this.addTaskForm.content;
      task.deadlineTime = this.addTaskForm.deadlineTime;
      addTask(task).then((response) => {
        this.isAddTaskDialogOpen = false;
        this.tasks.push(response.data);
      });
    },
    resetAddTask() {
      this.addTaskForm.content = "";
      this.addTaskForm.deadlineTime = "";
    },
    cancleAddTask() {
      this.isAddTaskDialogOpen = false;
    },

    // 删除任务
    doDeleteTask(id) {
      var task = {};
      task.id = id;
      deleteTask(task).then((response) => {
        console.log(response);
        for (var i = 0; i < this.tasks.length; i++) {
          if (id == this.tasks[i].id) {
            this.tasks.splice(i, 1);
          }
        }
      });
    },

    // 更新任务
    preUpdateTask(task) {
      this.isUpdateTaskDrawerOpen = true;
      this.updateTaskForm.id = task.id;
      this.updateTaskForm.content = task.content;
      this.updateTaskForm.createTime = task.createTime;
      this.updateTaskForm.deadlineTime = task.deadlineTime;
      this.updateTaskForm.taskSteps = task.taskSteps;
    },    
    handleUpdateTaskDrawerClose() {
      this.isUpdateTaskDrawerOpen = false;
    },
    doUpdateTask() {
      this.changedTask.id = this.updateTaskForm.id;
      //todo 为updateTaskForm中的input设置changed事件,将更新后的值存入changedTask
      updateTask(this.changedTask);
    },
    cancleUpdateTask() {
      this.isUpdateTaskDrawerOpen = false;
    },


    // 增加任务步骤
    doAddStep(step) {
      addStep(step).then((response) => {
        for (var i = 0; i < this.tasks.length; i++) {
          if (step.taskId == this.tasks[i].id) {
            if (!this.tasks[i].taskSteps) {
              this.tasks[i].taskSteps = [];
            }
            this.tasks[i].taskSteps.push(response.data);
          }
        }
      });
    },
    
    // 删除任务步骤
    doDeleteStep(step) {
      deleteStep(step).then((response) => {
        console.log(response);
        var tasks = this.tasks;
        for (var i = 0; i < tasks.length; i++) {
          for (var j = 0; j < tasks[i].taskSteps.length; j++) {
            if (step.id == tasks[i].taskSteps[j].id) {
              this.tasks[i].taskSteps.splice(j, 1);
            }
          }
        }
      });
    },

    // 更新任务步骤
    doUpdateStep(step) {
      updateStep(step);
    }

  },
  created() {
    getTodoTask().then((response) => {
      this.tasks = response.data;
      this.loading = false;
    });
  },
};
</script>
<style>
#font-size-24 {
  font-size: 24px;
}
.font-size-18 {
  font-size: 18px;
}
.margin-4-10 {
  margin: 4px 10px;
}
</style>