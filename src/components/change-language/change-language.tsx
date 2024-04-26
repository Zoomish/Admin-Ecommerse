import React, { FC } from 'react'
import { TRest } from '../../utils/typesFromBackend'

interface IChangeLanguage {
  rest: TRest
  t: (arg0: string) => string
  changeLanguage: (arg0: string) => void
}
const ChangeLanguage: FC<IChangeLanguage> = ({ changeLanguage }) => {
  const [selectedOption, setSelectedOption] = React.useState('')
  const arrayLanguage = ['RU', 'EN', 'KZ']

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    setSelectedOption(values)
    changeLanguage(values)
  }

  return (
    <>
      <select
        id='my-select'
        value={selectedOption}
        onChange={(e) => onFinish(e.target.value)}
      >
        {arrayLanguage.map((country) => {
          return (
            <option key={country} value={country}>
              {country}
            </option>
          )
        })}
      </select>
    </>
  )
}
export default ChangeLanguage
