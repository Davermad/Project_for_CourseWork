import { Input, Radio } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default function TaskFilter({
  filterStatus,
  onFilterChange,
  searchText,
  onSearchChange,
  totalTasks,
  completedTasks,
}) {
  return (
    <div className="filter-bar">
      <Input
        placeholder="Поиск по названию..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        style={{ width: 250 }}
      />
      <Radio.Group
        value={filterStatus}
        onChange={(e) => onFilterChange(e.target.value)}
        optionType="button"
        buttonStyle="solid"
      >
        <Radio.Button value="all">Все</Radio.Button>
        <Radio.Button value="active">Активные</Radio.Button>
        <Radio.Button value="completed">Выполненные</Radio.Button>
      </Radio.Group>
      <span className="stats">
        Выполнено: {completedTasks} / {totalTasks}
      </span>
    </div>
  )
}
