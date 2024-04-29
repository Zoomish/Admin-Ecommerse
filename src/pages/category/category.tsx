/* eslint-disable multiline-ternary */
import * as adminAPI from '../../utils/api/category-api'
import React, { FC, useContext } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { TAdmin } from '../../utils/typesFromBackend'
import { Button, Modal, Segmented } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import AdminPassword from '../../components/admin-password/admin-password'
import AdminUpdate from '../../components/admin-update/admins-update'

interface IEditorRest {
  token: string
  t: (arg0: string) => string
  pathRest: string
}

const Admin: FC<IEditorRest> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  const [admin, setAdmin] = React.useState<TAdmin>({} as TAdmin)
  const [isRest, setIsRest] = React.useState(false)
  const [value, setValue] = React.useState<string | number>(t('admin'))
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  React.useEffect(() => {
    adminAPI
      .getAdmin(token, restId)
      .then((res: TAdmin) => {
        setIsRest(true)
        setAdmin(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  return (
    <>
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
        {admin?.nickname ? admin.nickname : ''}
      </h4>
      <Segmented
        block
        options={[t('admin'), t('password')]}
        value={value}
        onChange={setValue}
      />{' '}
      {isRest ? (
        value === t('admin') ? (
          <AdminUpdate token={token} pathRest={pathRest} t={t} />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isRest ? (
        value === t('password') ? (
          <AdminPassword
            token={token}
            pathRest={pathRest}
            t={t}
          ></AdminPassword>
        ) : (
          ''
        )
      ) : (
        ''
      )}
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
    </>
  )
}
export default Admin
