import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { ECountry, TAdmin, TRest } from '../../utils/typesFromBackend'
import * as adminAPI from '../../utils/api/admin-api'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as restaurantAPI from '../../utils/api/restaurant-api'

interface ILevelsAccess {
  text: string
  value: string
}

interface IAdmins {
  token: string
  pathRest: string
  t: (arg0: string) => string
  language: ECountry
}

const Admins: FC<IAdmins> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)

  const [data, setData] = React.useState<TAdmin[]>([])
  const [levelsAccess, setLevelsAccess] = React.useState<ILevelsAccess[]>([])
  const [PathRest, setPathRest] = React.useState<{ [key: string]: string }>({})
  const location = useLocation()

  React.useEffect(() => {
    restaurantAPI
      .getRestaurants(token)
      .then((res) => {
        const nameRests: { [key: string]: string } = {}
        res.rests.forEach((rest: TRest) => {
          if (!nameRests[rest.titleRest] && rest.titleRest) {
            nameRests[rest._id] = rest.titleRest
          }
        })
        setPathRest(nameRests)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])
  React.useEffect(() => {
    adminAPI
      .getAllAdmins(token)
      .then((res) => {
        setData(res.admins)
        const levelsAccessNames: { [key: string]: boolean } = {}
        const resultArrayLevels: ILevelsAccess[] = []
        res.admins.forEach((admin: TAdmin) => {
          if (!levelsAccessNames[admin.level_access]) {
            levelsAccessNames[admin.level_access] = true
          }
        })
        for (const key of Object.keys(levelsAccessNames)) {
          resultArrayLevels.push({ text: key, value: key })
        }
        setLevelsAccess(resultArrayLevels)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])
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
      title: `${t('restaurant')}`,
      dataIndex: 'rest_id',
      key: 'rest_id',
      render: (restId) => (
        <Link
          to={
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            restId ? `/${pathRest}/restaurant/:${restId}` : `/${pathRest}/add/restaurant`
          }
        >
          {PathRest[restId] ? PathRest[restId] : t('no-restaurant')}
        </Link>
      ),
      sorter: (a, b) => {
        if (a.rest_id !== undefined && b.rest_id !== undefined) {
          try {
            return PathRest[a.rest_id].localeCompare(PathRest[b.rest_id])
          } catch (error: any) {
            openNotification(error, 'topRight')
          }
        }
        return 0
      }
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
    }
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          marginBottom: '1rem',
          alignItems: 'center',
          outline: 'none',
          padding: '0'
        }}
      >
        <div style={{ display: 'block', marginRight: 'auto' }}>
          <h2 style={{ fontWeight: 600, marginBottom: '0' }}>
            {t('admins')}
          </h2>
          <p style={{ marginBottom: '0' }}>{t('list-of-admins')}</p>
        </div>
        <NavLink
          to={`/${pathRest}/add/admin`}
          style={{
            color: '#fff',
            backgroundColor: '#2bc155',
            borderColor: '#2bc155',
            width: '145px',
            height: '61px',
            borderRadius: '0.375rem',
            fontWeight: '500',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {t('add')}
        </NavLink>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
export default Admins
