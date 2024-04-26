import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ELevelAccess, TAdmin, TRest } from '../../utils/typesFromBackend'
import { Form, Input, Button, Select, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as adminAPI from '../../utils/api/admin-api'
import * as restaurantAPI from '../../utils/api/restaurant-api'

interface IAddAdmin {
  pathRest: string
  token: string
  t: (arg0: string) => string
}

const AddAdmin: FC<IAddAdmin> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [PathRest, setPathRest] = React.useState<{ [key: string]: string }>({})
  const [, setLogin] = React.useState('')
  const [, setPassword] = React.useState('')
  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(e.target.value)
  }

  function handleChangeNickname(e: React.ChangeEvent<HTMLInputElement>): void {
    setLogin(e.target.value)
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
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
  const onFinish = (values: any): void => {
    const newLanguageRest: any = {
      nickname: values.nickname,
      password: values.password,
      level_access: Number(values.level_access),
      rest_id: PathRest[values.restaurant]
    }
    adminAPI
      .createAdmin(token, newLanguageRest)
      .then((res: TAdmin) => {
        history.push(`/${pathRest}/admins`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }
  return (
    <>
      {
        <Modal
          title={t('alert')}
          visible={isModalVisible}
          footer={[
            <Button key='ok' type='primary' onClick={handleModalClose}>
              {t('close')}
            </Button>
          ]}
        >
          {t('field_must_not_empty')}
        </Modal>
      }
      <h4
        style={{
          marginBottom: '15px',
          marginTop: '0',
          color: '#000',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {t('add-admin')}
      </h4>
      <Form
        {...layout}
        onFinish={onFinish}
        validateMessages={validateMessages}
        name='dish'
        form={form}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item
          label={t('login')}
          rules={[
            { required: true },
            {
              validator: async (_, value) =>
                !value.includes(' ')
                  ? await Promise.resolve()
                  : await Promise.reject(new Error(t('no-spaces-allowed')))
            }
          ]}
          name='nickname'
        >
          <Input
            maxLength={20}
            showCount={true}
            onChange={handleChangeNickname}
          />
        </Form.Item>
        <Form.Item
          label={t('password')}
          rules={[{ required: true }]}
          name='password'
        >
          <Input.Password onChange={handleChangePassword} />
        </Form.Item>
        <Form.Item
          label={t('сonfirm-password')}
          dependencies={['password']}
          name='confirm'
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
                return await Promise.reject(
                  new Error(t('password-do-not-match'))
                )
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label={t('restaurant')} name='restaurant' required={true}>
          <Select>
            {Object.keys(PathRest).map((levelAccess: any, index: number) => (
              <Select.Option value={levelAccess} key={index}>
                {levelAccess}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t('level_access')}
          name='level_access'
          required={true}
        >
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
      </Form>
    </>
  )
}
export default AddAdmin
