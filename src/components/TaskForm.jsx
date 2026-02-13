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
          ...initialValues,
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
      onCancel={onCancel}
      okText={isEditing ? 'Сохранить' : 'Создать'}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ priority: 'medium', category: 'other' }}>
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Что нужно сделать?" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="category" label="Категория">
            <Select options={[
              { value: 'work', label: 'Работа' },
              { value: 'study', label: 'Учеба' },
              { value: 'personal', label: 'Личное' },
              { value: 'other', label: 'Другое' },
            ]} />
          </Form.Item>

          <Form.Item name="priority" label="Приоритет">
            <Select options={[
              { value: 'high', label: 'Высокий 🔥' },
              { value: 'medium', label: 'Средний' },
              { value: 'low', label: 'Низкий' },
            ]} />
          </Form.Item>
        </div>

        <Form.Item name="deadline" label="Дедлайн">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <TextArea rows={2} placeholder="Дополнительные детали..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}