import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { ECountry, TRest } from '../../utils/typesFromBackend'
import * as restaurantAPI from '../../utils/api/restaurant-api'
import { Link, NavLink, useLocation } from 'react-router-dom'
import imageNoPhoto from '../../assets/images/no_photo.png'
import { BASE_URL_CDN } from '../../utils/const'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface InameTariffs {
  text: string
  value: string
}

interface IMenu {
  token: string
  pathRest: string
  t: (arg0: string) => string
  language: ECountry
}

const Restaurants: FC<IMenu> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)

  const [data, setData] = React.useState<TRest[]>([])
  const [nameTariffs, setnameTariffs] = React.useState<InameTariffs[]>([])
  const location = useLocation()

  React.useEffect(() => {
    restaurantAPI
      .getRestaurants(token)
      .then((res) => {
        setData(res)
        const objectNames: { [key: string]: boolean } = {}
        const resultArraynameTariffs: InameTariffs[] = []
        res.forEach((dish: TRest) => {
          if (!objectNames[dish.category as string]) {
            objectNames[dish.tariff as string] = true
          }
        })
        for (const key of Object.keys(objectNames)) {
          resultArraynameTariffs.push({ text: key, value: key })
        }
        setnameTariffs(resultArraynameTariffs)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const columns: ColumnsType<TRest> = [
    {
      title: `${t('image')}`,
      dataIndex: 'logoPath',
      key: 'logoPath',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (logoPath) =>
        logoPath ? (
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          <img
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            src={`${BASE_URL_CDN}/${logoPath}`}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = imageNoPhoto
            }}
          />
        ) : (
          <img
            src={imageNoPhoto}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        )
    },
    {
      title: `${t('name')}`,
      dataIndex: 'titleRest',
      key: 'titleRest',
      render: (titleRest, rest) => (
        <Link to={`/${pathRest}/restaurant/:${rest._id}`}>{titleRest}</Link>
      ),
      sorter: (a, b) => {
        if (a.titleRest !== undefined && b.titleRest !== undefined) {
          return a.titleRest.localeCompare(b.titleRest)
        }
        return 0
      }
    },
    {
      title: `${t('tariff')}`,
      dataIndex: 'tariff',
      key: 'tariff',
      render: (tariff) => <p>{tariff}</p>,
      sorter: (a, b) => (a.tariff as string).localeCompare(b.tariff as string),
      filters: [...nameTariffs],
      onFilter: (value: string | number | boolean, record) =>
        record.tariff === value
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
            {t('restaurants')}
          </h2>
          <p style={{ marginBottom: '0' }}>{t('list-of-restaurants')}</p>
        </div>
        <NavLink
          to={`/${pathRest}/add/restaurant`}
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
export default Restaurants
