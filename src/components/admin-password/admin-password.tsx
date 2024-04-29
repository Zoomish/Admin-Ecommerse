import { Form, Button, Input } from 'antd'
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { TAdmin } from '../../utils/typesFromBackend'
import * as adminAPI from '../../utils/api/category-api'
import { NotificationContext } from '../notification-provider/notification-provider'

interface IGroupModifiersForDish {
  pathRest: string
  token: string
  t: (arg0: string) => string
}

const AdminPassword: FC<IGroupModifiersForDish> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  // eslint-disable-next-line prefer-regex-literals
  // const { restId } = useParams<{ restId: string }>()
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [admin, setAdmin] = React.useState<TAdmin>({} as TAdmin)
  const [formData, setFormData] = React.useState(() => {
    const storedFormDataString = localStorage.getItem('formDataAdmin')
    return storedFormDataString ? JSON.parse(storedFormDataString) : null
  })

  const handleFormChange = (): void => {
    const allValues = form.getFieldsValue()
    const updateallValues = { ...allValues, _id: admin._id }
    setFormData(updateallValues)
  }

  React.useEffect(() => {
    if (Object.keys(admin).length > 0 && formData) {
      if (admin._id !== formData._id) {
        localStorage.removeItem('formDataAdmin')
      }
    }
    localStorage.setItem('formDataAdmin', JSON.stringify(formData))
  }, [formData])

  React.useEffect(() => {
    adminAPI
      .getAdmin(token, restId)
      .then((res: TAdmin) => {
        setAdmin(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  React.useEffect(() => {
    const storedFormDataString = localStorage.getItem('formDataAdmin')
    const parsedFormData = storedFormDataString
      ? JSON.parse(storedFormDataString)
      : null
    if (parsedFormData && parsedFormData._id === admin._id) {
      form.setFieldsValue({
        password: parsedFormData.password
      })
    }
  }, [admin])
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  const onFinish = (values: any): void => {
    const passwordAdmin: any = {
      _id: admin._id,
      newPassword: values.password
    }
    adminAPI
      .updateAdminPassword(token, passwordAdmin)
      .then((res: TAdmin) => {
        localStorage.removeItem('formDataAdmin')
        history.push(`/${pathRest}/admins`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }
  return (
    <Form
      {...layout}
      onFinish={onFinish}
      validateMessages={validateMessages}
      name='admin'
      form={form}
      style={{ paddingTop: '1.5rem' }}
      onValuesChange={handleFormChange}
    >
      <Form.Item
        label={t('password')}
        rules={[{ required: true }]}
        name='password'
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label={t('сonfirm-password')}
        name='confirm'
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true
          },
          ({ getFieldValue }) => ({
            async validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return await Promise.resolve()
              }
              return await Promise.reject(new Error(t('password-do-not-match')))
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
        <Button type='primary' htmlType='submit'>
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}
export default AdminPassword
