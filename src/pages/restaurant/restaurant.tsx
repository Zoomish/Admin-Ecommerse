/* eslint-disable multiline-ternary */
import React, { FC, useContext } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { ECountry, TRest } from '../../utils/typesFromBackend'
import { Segmented } from 'antd'
import * as restaurantAPI from '../../utils/api/restaurant-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import EditorRest from '../../components/editor-rest/editor-rest'
import AdminsForRest from '../../components/admins-for-rest/admins-for-rest'
import EditorRestMenu from '../../components/editor-rest-menu/editor-rest-menu'

interface IRest {
  token: string
  t: (arg0: string) => string
  language: ECountry
  pathRest: string
}

const Restaurant: FC<IRest> = ({ token, t, pathRest, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  const [value, setValue] = React.useState<string | number>(t('restaurant'))
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [rest, setRest] = React.useState<TRest>({} as TRest)
  const [isRest, setIsRest] = React.useState(false)

  React.useEffect(() => {
    restaurantAPI
      .getRestaurant(token, restId)
      .then((res) => {
        setRest(res)
        setIsRest(true)
        const localStorageValue = window.localStorage.getItem('value')
        if (localStorageValue) {
          setValue(t(localStorageValue))
        } else {
          setValue(t('restaurant'))
          window.localStorage.removeItem('value')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  React.useEffect(() => {
    return () => {
      window.localStorage.removeItem('value')
    }
  }, [])

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
        {isRest && rest && rest.titleRest ? rest.titleRest : ''}
      </h4>
      <Segmented
        block
        options={[t('restaurant'), t('admins'), t('menu')]}
        value={value}
        onChange={setValue}
      />{' '}
      {isRest ? (
        value === t('restaurant') ? (
          <EditorRest
            allCategories={[]}
            token={token}
            pathRest={pathRest}
            t={t}
            language={language}
          ></EditorRest>
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isRest ? (
        value === t('admins') ? (
          <AdminsForRest
            token={token}
            pathRest={pathRest}
            t={t}
          ></AdminsForRest>
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isRest ? (
        value === t('menu') ? (
          <EditorRestMenu
            token={token}
            pathRest={pathRest}
            t={t}
          ></EditorRestMenu>
        ) : (
          ''
        )
      ) : (
        ''
      )}
    </>
  )
}
export default Restaurant
