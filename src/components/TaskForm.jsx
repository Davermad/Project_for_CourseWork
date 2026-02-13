import { useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker } from 'antd'
import dayjs from 'dayjs'

const { TextArea } = Input

export default function TaskForm({ open, onCancel, onSubmit, initialValues }) {
  const [form] = Form.useForm()
  const isEditing = !!initialValues

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          title: initialValues.title,
          description: initialValues.description,
          priority: initialValues.priority,
          deadline: initialValues.deadline ? dayjs(initialValues.deadline) : null,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, initialValues, form])

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title={isEditing ? 'Редактировать задачу' : 'Новая задача'}
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      okText={isEditing ? 'Сохранить' : 'Добавить'}
      cancelText="Отмена"
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ priority: 'medium' }}>
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true, message: 'Введите название задачи' }]}
        >
          <Input placeholder="Введите название задачи" />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <TextArea rows={3} placeholder="Описание задачи (необязательно)" />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Приоритет"
          rules={[{ required: true, message: 'Выберите приоритет' }]}
        >
          <Select
            options={[
              { value: 'high', label: 'Высокий' },
              { value: 'medium', label: 'Средний' },
              { value: 'low', label: 'Низкий' },
            ]}
          />
        </Form.Item>
        <Form.Item name="deadline" label="Дедлайн">
          <DatePicker style={{ width: '100%' }} placeholder="Выберите дату" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
