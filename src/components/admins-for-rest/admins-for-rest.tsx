import { Popconfirm, Select, Table, Form, Button } from 'antd'
import React, { FC, useContext } from 'react'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { TAdmin } from '../../utils/typesFromBackend'
import { DeleteTwoTone } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import * as adminAPI from '../../utils/api/category-api'
import { NotificationContext } from '../notification-provider/notification-provider'

interface ILevelsAccess {
  text: string
  value: string
}

interface IGroupModifiersForDish {
  pathRest: string
  token: string
  t: (arg0: string) => string
}

const AdminsForRest: FC<IGroupModifiersForDish> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  const [data, setData] = React.useState<TAdmin[]>([])
  const [unUsedAdmins, setUnUsedAdmins] = React.useState<TAdmin[]>([])
  const [levelsAccess, setLevelsAccess] = React.useState<ILevelsAccess[]>([])
  const [update, setUpdate] = React.useState<boolean>(true)
  const location = useLocation()

  React.useEffect(() => {
    adminAPI
      .getAllCategories()
      .then((res) => {
        const nameRests: TAdmin[] = []
        const unUsedAdmied: TAdmin[] = []
        res.admins.forEach((admin: TAdmin) => {
          if (admin.rest_id === restId) {
            nameRests.push(admin)
          } else if (!admin.rest_id) unUsedAdmied.push(admin)
        })
        setUnUsedAdmins(unUsedAdmied)
        setData(nameRests)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [restId, update])

  React.useEffect(() => {
    const levelsAccessNames: { [key: string]: boolean } = {}
    const resultArrayLevels: ILevelsAccess[] = []
    data.forEach((admin: TAdmin) => {
      if (!levelsAccessNames[admin.level_access]) {
        levelsAccessNames[admin.level_access] = true
      }
    })
    for (const key of Object.keys(levelsAccessNames)) {
      resultArrayLevels.push({ text: key, value: key })
    }
    setLevelsAccess(resultArrayLevels)
  }, [data])
  function handleDeleteModifierFromDish(values: any): void {
    const newLanguageRest: any = {
      _id: values._id,
      nickname: values.nickname,
      password: values.password,
      level_access: Number(values.level_access),
      rest_id: ''
    }
    adminAPI
      .updateAdmin(token, newLanguageRest)
      .then((res: any) => {
        setUpdate(!update)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const columns: ColumnsType<TAdmin> = [
    {
      title: `${t('login')}`,
      dataIndex: 'nickname',
      key: 'nickname',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (nickname, admin) => (
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        <Link to={`/${pathRest}/admin/:${admin._id}`}>{nickname}</Link>
      )
    },
    {
      title: `${t('level_access')}`,
      dataIndex: 'level_access',
      key: 'level_access',
      render: (levelAccess) => <p>{levelAccess}</p>,
      sorter: (a, b) => a.level_access - b.level_access,
      filters: [...levelsAccess],
      onFilter: (value: string | number | boolean, record) =>
        // eslint-disable-next-line eqeqeq
        record.level_access == value
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        data.length >= 1 ? (
          <Popconfirm
            title={t('delete-admin-from-restaurant')}
            onConfirm={() => handleDeleteModifierFromDish(record)}
          >
            <DeleteTwoTone />
          </Popconfirm>
        ) : null
    }
  ]
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 }
  }
  const [form] = Form.useForm()

  const onFinish = (values: any): void => {
    adminAPI
      .getAdmin(token, values._id)
      .then((res: TAdmin) => {
        const newLanguageRest: any = {
          _id: res._id,
          nickname: res.nickname,
          password: res.password,
          level_access: Number(res.level_access),
          rest_id: restId
        }
        adminAPI
          .updateAdmin(token, newLanguageRest)
          .then((res: any) => {
            setUpdate(!update)
          })
          .catch((e) => openNotification(e, 'topRight'))
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: t('you-nedd-choose-group-modifier-for-dish')
  }

  return (
    <>
      <Form
        {...layout}
        onFinish={onFinish}
        name='dish'
        form={form}
        validateMessages={validateMessages}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item
          label={t('add-admin')}
          name='_id'
          rules={[{ required: true }]}
        >
          <Select>
            {unUsedAdmins.map((admin, index) => (
              <Select.Option value={admin._id} key={index}>
                {admin.nickname}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary' htmlType='submit'>
            {t('add-admin-to-rest')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={data} />
    </>
  )
}
export default AdminsForRest
