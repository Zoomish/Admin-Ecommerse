import React, { FC } from 'react'
import { ECountry } from '../../utils/typesFromBackend'

interface IChangeLanguage {
  t: (arg0: string) => string
  changeLanguage: (lng: ECountry) => void
}
const ChoiseLanguage: FC<IChangeLanguage> = ({
  t,
  changeLanguage
}) => {
  const [selectedOption, setSelectedOption] = React.useState('')
  const restData = Object.keys(ECountry)
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
