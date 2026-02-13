import { Table, Tag, Button, Popconfirm, Checkbox, Space, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const priorityConfig = {
  high: { color: 'red', label: 'Высокий' },
  medium: { color: 'orange', label: 'Средний' },
  low: { color: 'green', label: 'Низкий' },
}

export default function TaskTable({ tasks, onEdit, onDelete, onToggleComplete }) {
  const columns = [
    {
      title: 'Статус',
      dataIndex: 'completed',
      key: 'completed',
      width: 70,
      align: 'center',
      render: (completed, record) => (
        <Checkbox checked={completed} onChange={() => onToggleComplete(record.id)} />
      ),
    },
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={record.description || undefined}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      align: 'center',
      render: (priority) => {
        const config = priorityConfig[priority]
        return config ? <Tag color={config.color}>{config.label}</Tag> : null
      },
    },
    {
      title: 'Дедлайн',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 130,
      align: 'center',
      render: (deadline) => {
        if (!deadline) return '—'
        const isOverdue = dayjs(deadline).isBefore(dayjs(), 'day')
        return <span style={isOverdue ? { color: 'red' } : undefined}>{deadline}</span>
      },
    },
    {
      title: 'Создана',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Удалить задачу?"
            description="Это действие нельзя отменить"
            onConfirm={() => onDelete(record.id)}
            okText="Удалить"
            cancelText="Отмена"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      dataSource={tasks}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      locale={{ emptyText: 'Нет задач' }}
      rowClassName={(record) => (record.completed ? 'task-completed' : '')}
    />
  )
}
