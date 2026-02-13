import { Table, Tag, Button, Popconfirm, Checkbox, Space, Typography, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

const priorityConfig = {
  high: { color: '#ff4d4f', label: 'Высокий', weight: 3 },
  medium: { color: '#faad14', label: 'Средний', weight: 2 },
  low: { color: '#52c41a', label: 'Низкий', weight: 1 },
}

const categoryConfig = {
  work: { label: 'Работа', color: 'blue' },
  personal: { label: 'Личное', color: 'purple' },
  study: { label: 'Учеба', color: 'cyan' },
  other: { label: 'Другое', color: 'default' },
}

export default function TaskTable({ tasks, onEdit, onDelete, onToggleComplete }) {
  const columns = [
    {
      title: 'Статус',
      dataIndex: 'completed',
      width: 80,
      sorter: (a, b) => a.completed - b.completed,
      render: (done, record) => (
        <Checkbox checked={done} onChange={() => onToggleComplete(record.id)} />
      ),
    },
    {
      title: 'Задача',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 0' }}>
          {/* Название задачи */}
          <Text 
            delete={record.completed} 
            strong={!record.completed} 
            style={{ fontSize: '15px', display: 'block' }}
          >
            {text}
          </Text>

          {/* Описание задачи (показывается только если оно заполнено) */}
          {record.description && (
            <Text 
              type="secondary" 
              style={{ 
                fontSize: '12px', 
                lineHeight: '1.4',
                maxWidth: '300px', // чтобы текст не растягивал таблицу слишком сильно
                marginBottom: '4px'
              }}
            >
              {record.description}
            </Text>
          )}

          {/* Тег категории */}
          <Tag 
            color={categoryConfig[record.category]?.color || 'default'} 
            style={{ 
              width: 'fit-content', 
              fontSize: '10px', 
              lineHeight: '16px',
              borderRadius: '4px',
              marginTop: '2px'
            }}
          >
            {categoryConfig[record.category]?.label || 'Другое'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      width: 120,
      sorter: (a, b) => priorityConfig[a.priority].weight - priorityConfig[b.priority].weight,
      render: (p) => <Tag color={priorityConfig[p].color}>{priorityConfig[p].label}</Tag>,
    },
    {
      title: 'Дедлайн',
      dataIndex: 'deadline',
      width: 150,
      sorter: (a, b) => dayjs(a.deadline || '9999-12-31').unix() - dayjs(b.deadline || '9999-12-31').unix(),
      render: (date, record) => {
        if (!date) return <Text type="secondary">—</Text>
        const isOverdue = dayjs(date).isBefore(dayjs(), 'day') && !record.completed
        return (
          <Tag icon={<ClockCircleOutlined />} color={isOverdue ? 'error' : 'default'}>
            {dayjs(date).format('DD.MM.YY')}
          </Tag>
        )
      },
    },
    {
      title: 'Действия',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Удалить?" onConfirm={() => onDelete(record.id)} okText="Да" cancelText="Нет">
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
      pagination={{ pageSize: 7 }}
      scroll={{ x: 600 }}
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0, paddingLeft: '50px', color: 'gray' }}>
            <strong>Описание:</strong> {record.description || 'Нет описания для этой задачи'}
          </p>
        ),
        rowExpandable: (record) => !!record.description, // разворачивать только если есть описание
      }}
    />
  )
}