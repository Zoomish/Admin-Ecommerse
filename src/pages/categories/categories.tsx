import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { ECountry, TCategory } from '../../utils/typesFromBackend'
import * as adminAPI from '../../utils/api/category-api'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import imageNoPhoto from '../../assets/images/no_photo.png'
import { BASE_URL } from '../../utils/const'

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

const Categories: FC<IAdmins> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)

  const [data, setData] = React.useState<TCategory[]>([])
  const [, setLevelsAccess] = React.useState<ILevelsAccess[]>([])
  const location = useLocation()
  React.useEffect(() => {
    adminAPI
      .getAllCategories()
      .then((res) => {
        setData(res)
        const levelsAccessNames: { [key: string]: boolean } = {}
        const resultArrayLevels: ILevelsAccess[] = []
        for (const key of Object.keys(levelsAccessNames)) {
          resultArrayLevels.push({ text: key, value: key })
        }
        setLevelsAccess(resultArrayLevels)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])
  const columns: ColumnsType<TCategory> = [
    {
      title: `${t('logo')}`,
      dataIndex: 'image',
      key: 'image',
      render: (image, admin) => (
        <img
          style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          src={admin.image ? `${BASE_URL}/${admin.image}` : `${imageNoPhoto}`}
          onError={(e) => {
            e.currentTarget.src = imageNoPhoto
          }}
        />
      )
    },
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, restId) => (
        <Link to={`/${pathRest}/category/:${restId.id}`}>{title}</Link>
      ),
      sorter: (a, b) => {
        if (a.title !== undefined && b.title !== undefined) {
          try {
            return a.title.localeCompare(b.title)
          } catch (error: any) {
            openNotification(error, 'topRight')
          }
        }
        return 0
      }
    },
    {
      title: `${t('quantity-dishes')}`,
      dataIndex: 'items',
      key: 'items',
      render: (image, category) => <p>{category.items.length}</p>,
      sorter: (a, b) => a.items.length - b.items.length
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
            {t('categories')}
          </h2>
          <p style={{ marginBottom: '0' }}>{t('your-list-categories')}</p>
        </div>
        <NavLink
          to={`/${pathRest}/add/category`}
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
export default Categories
