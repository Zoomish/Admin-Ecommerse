import React, { FC, useContext } from 'react'
import { ECountry } from '../../utils/typesFromBackend'
import * as countryApi from '../../utils/api/country-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IChangeLanguage {
  t: (arg0: string) => string
  changeLanguage: (lng: ECountry) => void
}
const ChoiseLanguage: FC<IChangeLanguage> = ({
  t,
  changeLanguage
}) => {
  const { openNotification } = useContext(NotificationContext)
  const [selectedOption, setSelectedOption] = React.useState('')
  const restData = Object.keys(ECountry)

  React.useEffect(() => {
    countryApi
      .getListCountries('632c1700641f6cf6642b2ba9')
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    if (
      storedLanguage &&
      Object.values(ECountry).includes(storedLanguage as ECountry)
    ) {
      setSelectedOption(storedLanguage)
      changeLanguage(storedLanguage as ECountry)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    setSelectedOption(values)
    changeLanguage(values)
    localStorage.setItem('language', values)
    localStorage.removeItem('formDataDish')
  }

  return (
    <>
      {restData && Array.isArray(restData)
        ? (
        <>
          <select
            id='my-select'
            value={selectedOption}
            onChange={(e) => onFinish(e.target.value)}
          >
            {restData.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </>
          )
        : (
            ''
          )}
    </>
  )
}
export default ChoiseLanguage
