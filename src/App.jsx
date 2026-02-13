import { useState, useEffect, useMemo } from 'react'
import { Layout, Button, message, ConfigProvider, theme, Progress, Space, Typography, Switch } from 'antd'
import { PlusOutlined, CheckCircleOutlined, DeleteOutlined, BulbOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import TaskTable from './components/TaskTable'
import TaskForm from './components/TaskForm'
import TaskFilter from './components/TaskFilter'
import './App.css'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography
const STORAGE_KEY = 'task-manager-tasks'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  })
  
  // Состояние темы (светлая/темная)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const handleTaskAction = (values) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...values, deadline: values.deadline?.format('YYYY-MM-DD') } : t))
      messageApi.success('Задача обновлена')
    } else {
      const newTask = {
        ...values,
        id: Date.now().toString(),
        completed: false,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
        deadline: values.deadline?.format('YYYY-MM-DD')
      }
      setTasks(prev => [newTask, ...prev])
      messageApi.success('Задача создана')
    }
    setIsModalOpen(false)
  }

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed))
    messageApi.success('Выполненные задачи удалены')
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'completed' ? t.completed : !t.completed)
      const matchesSearch = t.title.toLowerCase().includes(searchText.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [tasks, filterStatus, searchText])

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { borderRadius: 8, colorPrimary: '#52c41a' } 
      }}
    >
      {contextHolder}
      <Layout className={`app-layout ${isDarkMode ? 'dark-mode' : ''}`}>
        <Header className="app-header">
          <Space size="middle">
            <CheckCircleOutlined className="header-icon" />
            <Title level={3} className="app-title">TaskFlow</Title>
          </Space>
          
          <Space size="large">
            <Space>
               <BulbOutlined />
               <Switch 
                 checked={isDarkMode} 
                 onChange={(val) => setIsDarkMode(val)} 
                 size="small"
               />
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingTask(null); setIsModalOpen(true); }}>
              Задача
            </Button>
          </Space>
        </Header>

        <Content className="app-content">
          <div className="stats-card">
            <div className="stats-header">
              <Text strong>Ваш прогресс</Text>
              <Button 
                danger 
                type="text" 
                size="small" 
                icon={<DeleteOutlined />} 
                onClick={clearCompleted}
                disabled={!tasks.some(t => t.completed)}
              >
                Очистить выполненные
              </Button>
            </div>
            <Progress percent={completionRate} strokeColor="#52c41a" />
          </div>

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
            onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }}
            onDelete={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
            onToggleComplete={(id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
          />
        </Content>

        <Footer className="app-footer">
          <Text type="secondary">TaskFlow project Created for Coursework</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>React + Ant Design + Day.js</Text>
        </Footer>

        <TaskForm 
          open={isModalOpen} 
          onCancel={() => setIsModalOpen(false)} 
          onSubmit={handleTaskAction} 
          initialValues={editingTask} 
        />
      </Layout>
    </ConfigProvider>
  )
}