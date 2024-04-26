import { Dispatch, FC, SetStateAction } from 'react'
import { Menu } from 'antd'
import {
  InfoCircleOutlined,
  LogoutOutlined,
  ContainerOutlined,
  UserOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons'
import { useHistory } from 'react-router'

interface ISidebar {
  pathRest: string
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  t: (arg0: string) => string
}
const Sidebar: FC<ISidebar> = ({ setIsLoggedIn, pathRest, t }) => {
  const history = useHistory()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUserClick = (): void => {
    history.push(`/${pathRest}/list`)
  }
  const handleRestaurantsClick = (): void => {
    history.push(`/${pathRest}/restaurants`)
  }
  const handleAdminsClick = (): void => {
    history.push(`/${pathRest}/admins`)
  }
  const handleInstructionClick = (): void => {
    history.push('/blog')
  }
  const handleRestClick = (): void => {
    // выход в меню
  }

  const handleLogout = (): void => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    history.push(`/${pathRest}/autorization`)
  }

  return (
    <>
      <div style={{ height: '32px', margin: '16px' }}></div>
      <Menu
        theme='light'
        mode='inline'
        style={{ textAlign: 'left' }}
        defaultSelectedKeys={['1']}
      >
        <Menu.Item key='1' onClick={handleRestaurantsClick}>
          <ContainerOutlined />
          <span>{t('restaurants')}</span>
        </Menu.Item>
        <Menu.Item key='2' onClick={handleAdminsClick}>
          <UserOutlined />
          <span>{t('admins')}</span>
        </Menu.Item>
        <Menu.Item key='3' onClick={handleInstructionClick}>
          <InfoCircleOutlined />
          <span>{t('manual')}</span>
        </Menu.Item>
        <Menu.Item key='4' onClick={handleRestClick}>
          <VerticalAlignTopOutlined />
          <span> {t('back-menu')}</span>
        </Menu.Item>
        <Menu.Item key='5' onClick={handleLogout}>
          <LogoutOutlined />
          <span>{t('quit')}</span>
        </Menu.Item>
      </Menu>
    </>
  )
}

export default Sidebar
