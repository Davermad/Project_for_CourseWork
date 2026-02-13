import { useState, useEffect } from 'react'
import { Layout, Button, message, ConfigProvider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import TaskTable from './components/TaskTable'
import TaskForm from './components/TaskForm'
import TaskFilter from './components/TaskFilter'
import './App.css'

const { Header, Content } = Layout

const STORAGE_KEY = 'task-manager-tasks'

function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (values) => {
    const newTask = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description || '',
      priority: values.priority,
      deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
      completed: false,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
    }
    setTasks((prev) => [newTask, ...prev])
    setIsModalOpen(false)
    messageApi.success('Задача добавлена')
  }

  const updateTask = (values) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: values.title,
              description: values.description || '',
              priority: values.priority,
              deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
            }
          : task
      )
    )
    setEditingTask(null)
    setIsModalOpen(false)
    messageApi.success('Задача обновлена')
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    messageApi.success('Задача удалена')
  }

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const openAddModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'active' && task.completed) return false
    if (filterStatus === 'completed' && !task.completed) return false
    if (searchText && !task.title.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      {contextHolder}
      <Layout className="app-layout">
        <Header className="app-header">
          <h1 className="app-title">Task Manager</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Добавить задачу
          </Button>
        </Header>
        <Content className="app-content">
          <TaskFilter
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            searchText={searchText}
            onSearchChange={setSearchText}
            totalTasks={tasks.length}
            completedTasks={tasks.filter((t) => t.completed).length}
          />
          <TaskTable
            tasks={filteredTasks}
            onEdit={openEditModal}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
          />
          <TaskForm
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingTask(null)
            }}
            onSubmit={editingTask ? updateTask : addTask}
            initialValues={editingTask}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
