/* eslint-disable multiline-ternary */
import React, { FC, useContext } from 'react'
import * as restaurantAPI from '../../utils/api/dishes-api'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { TRest, ETariff, ECountry } from '../../utils/typesFromBackend'
import { Form, Input, Button, Select, Popconfirm, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IRest {
  token: string
  t: (arg0: string) => string
  language: ECountry
  pathRest: string
}

const Dish: FC<IRest> = ({ token, t, pathRest, language }) => {
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
  const [rest, setDish] = React.useState<TRest>({} as TRest)
  const [isDishLoading, setIsDishLoading] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [formData, setFormData] = React.useState(() => {
    const storedFormDataString = localStorage.getItem('formDataRest')
    return storedFormDataString ? JSON.parse(storedFormDataString) : null
  })

  const handleFormChange = (): void => {
    const allValues = form.getFieldsValue()
    const updateallValues = { ...allValues, _id: rest._id }
    setFormData(updateallValues)
  }

  React.useEffect(() => {
    if (Object.keys(rest).length > 0 && formData) {
      if (rest._id !== formData._id) {
        localStorage.removeItem('formDataRest')
      }
    }
    localStorage.setItem('formDataRest', JSON.stringify(formData))
  }, [formData])

  React.useEffect(() => {
    restaurantAPI
      .getDish(restId)
      .then((res) => {
        setDish(res)
        const storedFormDataString = localStorage.getItem('formDataRest')
        const parsedFormData = storedFormDataString
          ? JSON.parse(storedFormDataString)
          : null

        if (parsedFormData && parsedFormData._id === rest._id) {
          form.setFieldsValue({
            title: parsedFormData.title
          })
          form.setFieldsValue({
            tariff: parsedFormData.tariff
          })
        } else {
          form.setFieldsValue({
            title: res.titleRest
          })
          form.setFieldsValue({
            tariff: res.tariff
          })
        }
        setIsDishLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguageDish: any = {}
    newLanguageDish.tariff = values.tariff
    newLanguageDish.titleRest = values.title
    newLanguageDish._id = rest._id
    restaurantAPI
      .updateRestaurant(token, newLanguageDish)
      .then((res: TRest) => {
        history.push(`/${pathRest}/restaurants`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function confirm(): void {
    restaurantAPI
      .deleteRestaurant(token, rest._id)
      .then(() => history.push(`/${pathRest}/restaurants`))
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
          open={isModalVisible}
          closable={false}
          footer={[
            <Button key='ok' type='primary' onClick={handleModalClose}>
              {t('close')}
            </Button>
          ]}
        >
          {t('field_must_not_empty')}
        </Modal>
      }
      {isDishLoading ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='rest'
          form={form}
          style={{ paddingTop: '1.5rem' }}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label={t('name')}
            rules={[{ required: true }]}
            name='title'
          >
            <Input />
          </Form.Item>
          <Form.Item required={true} label={t('tariff')} name='tariff'>
            <Select>
              {Object.keys(ETariff).map((tariff: any) => (
                <Select.Option value={tariff} key={tariff}>
                  {tariff}
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
      ) : (
        ''
      )}
    </>
  )
}
export default Dish
