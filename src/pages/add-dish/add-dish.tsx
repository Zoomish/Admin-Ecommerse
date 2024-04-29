import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import * as restaurantAPI from '../../utils/api/dishes-api'
import { TRest, TCategory } from '../../utils/typesFromBackend'
import { Form, Input, Button, Select, Upload, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import ImgCrop from 'antd-img-crop'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as adminAPI from '../../utils/api/category-api'

interface IFileList {
  url: string
  name: string
  uid: string
}

interface IAddDish {
  pathRest: string
  token: string
  t: (arg0: string) => string
}

const AddDish: FC<IAddDish> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  const [loading, setLoading] = React.useState(false)
  const [fileList, setFileList] = React.useState<IFileList[]>([])
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [categories, setCategories] = React.useState<TCategory[]>([])
  const [titleRest, setTitleRest] = React.useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [PathRest, setPathRest] = React.useState('')

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitleRest(e.target.value)
  }
  function handleChangePath(e: React.ChangeEvent<HTMLInputElement>): void {
    setPathRest(e.target.value)
  }

  function handleChangePrice(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitleRest(e.target.value)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader()
    // eslint-disable-next-line n/no-callback-literal
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  const beforeUpload = (file: RcFile): boolean => {
    const isJpgOrPngOrWebp =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp'
    if (!isJpgOrPngOrWebp) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      message.error(t('you-can-upload-file'))
    }
    const isLt4M = file.size / 1024 / 1024 < 4
    if (!isLt4M) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      message.error(t('image-must-be-less'))
    }
    return isJpgOrPngOrWebp && isLt4M
  }

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'removed') {
      setLoading(false)
      setFileList([])
      form.setFieldsValue({ image: null })
    } else {
      setLoading(true)
    }
    getBase64(info.file.originFileObj as RcFile, (url) => {
      const result = [{ url, name: titleRest, uid: '0' }]
      setFileList([...result])
      form.setFieldsValue({ image: info.file.originFileObj })
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  React.useEffect(() => {
    adminAPI
      .getAllCategories()
      .then((res) => {
        setCategories(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const formData = new FormData()
    formData.append('image', values.image)
    formData.append('title', values.title)
    formData.append('categoryId', values.categoryId)
    formData.append('description', values.description)
    formData.append('price', values.price)
    restaurantAPI
      .createDish(token, formData)
      .then((res: TRest) => {
        history.push(`/${pathRest}/dishes`)
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
        {t('add-dish')}
      </h4>
      <Form
        {...layout}
        onFinish={onFinish}
        validateMessages={validateMessages}
        name='dish'
        form={form}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item label={t('name')} rules={[{ required: true }]} name='title'>
          <Input onChange={handleChangeTitle} />
        </Form.Item>
        <Form.Item
          label={t('description')}
          rules={[{ required: true }]}
          name='description'
        >
          <Input onChange={handleChangePath} />
        </Form.Item>
        <Form.Item label={t('price')} rules={[{ required: true }]} name='price'>
          <Input onChange={handleChangePrice} />
        </Form.Item>
        <Form.Item
          label={t('image')}
          valuePropName='fileList'
          name='image'
          getValueFromEvent={({ file }) => file.originFileObj}
        >
          <ImgCrop rotate>
            <Upload
              action='/upload.do'
              listType='picture-card'
              onChange={handleChange}
              fileList={fileList}
              beforeUpload={beforeUpload}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onPreview={onPreview}
            >
              {loading ? (
                ''
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>{t('download')}</div>
                </div>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item label={t('category')} name='categoryId' required={true}>
          <Select>
            {categories.map((category: TCategory) => (
              <Select.Option value={category.id} key={category.id}>
                {category.title}
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
export default AddDish
