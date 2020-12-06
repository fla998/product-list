import React from 'react'
import { render, screen, fireEvent } from '@vtex/test-tools/react'
import { ToastContext } from '@vtex/styleguide/lib/ToastProvider'

import QuantitySelector from '../QuantitySelector'

describe('<QuantitySelector />', () => {
  it('should change from dropdown to input after quantity exceeds max value', () => {
    const onChange = jest.fn()

    render(
      <QuantitySelector id="1" value={5} maxValue={50} onChange={onChange} />
    )

    const [dropdown] = screen.getAllByRole('combobox')

    expect(dropdown).toHaveValue('5')

    fireEvent.change(dropdown, { target: { value: '10' } })

    expect(onChange).toHaveBeenLastCalledWith(10)
    expect(dropdown).not.toBeInTheDocument()

    const [input] = screen.getAllByRole('textbox')

    expect(input).toHaveValue('10')
  })

  it('should change back to dropdown after changing the value to under max value', () => {
    const onChange = jest.fn()

    render(
      <QuantitySelector id="1" value={10} maxValue={50} onChange={onChange} />
    )

    const [input] = screen.getAllByRole('textbox')

    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenLastCalledWith(5)
    expect(input).not.toBeInTheDocument()
  })

  it("shouldn't display default measurement unit value", () => {
    render(
      <QuantitySelector
        id="1"
        value={1}
        maxValue={50}
        onChange={jest.fn()}
        measurementUnit="un"
      />
    )

    const [dropdown] = screen.getAllByRole('combobox')

    expect(dropdown).toHaveDisplayValue('1')
  })

  it("shouldn't display raw quantity value when unit multiplier exists", () => {
    const onChange = jest.fn()

    render(
      <QuantitySelector
        id="1"
        value={1}
        maxValue={50}
        onChange={onChange}
        unitMultiplier={0.5}
        measurementUnit="kg"
      />
    )

    const [dropdown] = screen.getAllByRole('combobox')

    expect(dropdown).toHaveValue('1')
    expect(dropdown).toHaveDisplayValue('0.5 kg')

    let options = screen.getAllByRole('option')

    // Get the first half options, because we have two
    // dropdowns in the page
    options = options.slice(0, options.length / 2)

    expect(options).toHaveLength(12)

    expect(options[1]).toHaveTextContent('0 - Remove')
    expect(options[1]).toHaveValue('0')

    expect(options[11]).toHaveTextContent('5 kg +')
    expect(options[11]).toHaveValue('10')

    fireEvent.change(dropdown, { target: { value: '10' } })
    expect(onChange).toHaveBeenLastCalledWith(10)

    expect(dropdown).not.toBeInTheDocument()

    const [input] = screen.getAllByRole('textbox')

    expect(input).toHaveValue('5')

    fireEvent.change(input, { target: { value: '6' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenLastCalledWith(12)
  })

  it('can handle decimal values with both periods and commas with unit multiplier', () => {
    const onChange = jest.fn()
    const showToast = jest.fn()

    render(
      <ToastContext.Provider
        value={{ showToast, hideToast: jest.fn(), toastState: {} }}
      >
        <QuantitySelector
          id="1"
          value={10}
          maxValue={50}
          onChange={onChange}
          unitMultiplier={0.5}
          measurementUnit="kg"
        />
      </ToastContext.Provider>
    )

    const [input] = screen.getAllByRole('textbox')

    fireEvent.change(input, { target: { value: '5.5' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenLastCalledWith(11)

    fireEvent.change(input, { target: { value: '5.6' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenLastCalledWith(11)

    expect(showToast).toHaveBeenCalledTimes(1)
    expect(showToast).toHaveBeenLastCalledWith(
      'This product is sold by fractions of 0.5kg. Given that, the inserted quantity has been rounded to 5.5kg.'
    )

    fireEvent.change(input, { target: { value: '6,5' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenLastCalledWith(13)
  })

  it('should not include grouping separators on large numbers', () => {
    const onChange = jest.fn()

    render(
      <QuantitySelector id="1" value={10} maxValue={1000} onChange={onChange} />
    )

    const [input] = screen.getAllByRole('textbox')

    fireEvent.change(input, { target: { value: '1000' } })
    fireEvent.blur(input)

    expect(input).toHaveValue('1000')
    expect(onChange).toHaveBeenLastCalledWith(1000)
  })
})
