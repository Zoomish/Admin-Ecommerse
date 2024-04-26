import { Popconfirm, Select, Form, Button, Input } from 'antd'
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { ELevelAccess, TAdmin, TRest } from '../../utils/typesFromBackend'
import * as adminAPI from '../../utils/api/admin-api'
import { NotificationContext } from '../notification-provider/notification-provider'
import * as restaurantAPI from '../../utils/api/restaurant-api'

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
  const [PathRest, setPathRest] = React.useState<{ [key: string]: string }>({})
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
    restaurantAPI
      .getRestaurants(token)
      .then((res) => {
        const nameRests: { [key: string]: string } = {}
        res.rests.forEach((rest: TRest) => {
          if (!nameRests[rest.titleRest] && rest.titleRest) {
            nameRests[rest.titleRest] = rest._id
          }
        })
        setPathRest(nameRests)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

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
        nickname: parsedFormData.nickname
      })
      form.setFieldsValue({
        level_access: parsedFormData.level_access
      })
      form.setFieldsValue({
        rest_id: parsedFormData.rest_id
      })
    } else {
      form.setFieldsValue({
        nickname: admin.nickname
      })
      form.setFieldsValue({
        level_access: admin.level_access
      })
      form.setFieldsValue({
        rest_id: admin.rest_id
          ? Object.keys(PathRest).find((k) => PathRest[k] === admin.rest_id)
          : ''
      })
    }
  }, [admin])
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  const onFinish = (values: any): void => {
    const newLanguageRest: any = {
      _id: admin._id,
      nickname: values.nickname,
      level_access: Number(values.level_access),
      rest_id: values.rest_id ? PathRest[values.rest_id] : ''
    }
    adminAPI
      .updateAdmin(token, newLanguageRest)
      .then((res: TAdmin) => {
        localStorage.removeItem('formDataAdmin')
        history.push(`/${pathRest}/admins`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function confirm(): void {
    adminAPI
      .deleteAdmin(token, admin._id)
      .then(() => history.push(`/${pathRest}/admins`))
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
      <Form.Item label={t('login')} name='nickname'>
        <Input />
      </Form.Item>
      <Form.Item label={t('restaurant')} name='rest_id'>
        <Select>
          <Select.Option value={''} key={'no-rest'}>
            {t('no-restaurant')}
          </Select.Option>
          {Object.keys(PathRest).map((levelAccess: any, index: number) => (
            <Select.Option value={levelAccess} key={index}>
              {levelAccess}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t('level_access')} name='level_access'>
        <Select>
          {Object.values(ELevelAccess).map((levelAccess: ELevelAccess) => (
            <Select.Option value={levelAccess} key={levelAccess}>
              {levelAccess}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
        <Button type='primary' htmlType='submit'>
          {t('save')}
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
        <Popconfirm
          title={t('you-sure-want-delete')}
          onConfirm={confirm}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button htmlType='button'>{t('delete')}</Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  )
}
export default AdminPassword
