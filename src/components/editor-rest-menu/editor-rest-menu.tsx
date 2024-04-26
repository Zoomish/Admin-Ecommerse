/* eslint-disable multiline-ternary */
import React, { FC, useContext } from 'react'
import * as restaurantAPI from '../../utils/api/restaurant-api'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { TRest } from '../../utils/typesFromBackend'
import { Button, Modal, Upload } from 'antd'
import { NotificationContext } from '../notification-provider/notification-provider'
import { InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload

interface IEditorRest {
  token: string
  t: (arg0: string) => string
  pathRest: string
}

const EditorRestMenu: FC<IEditorRest> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  // eslint-disable-next-line prefer-regex-literals
  // const { restId } = useParams<{ restId: string }>()
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [rest, setDish] = React.useState<TRest>({} as TRest)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  React.useEffect(() => {
    restaurantAPI
      .getRestaurant(token, restId)
      .then((res) => {
        setDish(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  const draggerProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    customRequest: async ({ file }: { file: any }) => {
      const formData = new FormData()
      formData.append('file', file)
      restaurantAPI
        .importMenu(token, formData, rest.pathRest)
        .then((res) => {
          openNotification(t('menu-uploaded'), 'topRight')
        })
        .catch((e) => openNotification(e, 'topRight'))
    },
    accept: '.xls, .xlsx'
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
      <Dragger {...draggerProps}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          Click or drag file to this area to upload
        </p>
        <p className='ant-upload-hint'>
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
    </>
  )
}
export default EditorRestMenu
