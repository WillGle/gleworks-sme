// Covers positive quantity validation in the keyboard build form.
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Build from '@components/Service/Build'

const { mockGetServiceOptions } = vi.hoisted(() => ({
  mockGetServiceOptions: vi.fn(),
}))

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    getServiceOptions: mockGetServiceOptions,
  }
})

test('rejects non-positive switch quantities', async () => {
  const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
  mockGetServiceOptions.mockResolvedValue({
    options: [
      { id: 1, optionName: 'No Desoldering', price: 0, optionGroup: 'Desoldering' },
      { id: 2, optionName: 'Basic Assembly', price: 1000, optionGroup: 'Assembly' },
    ],
  })

  render(
    <MemoryRouter>
      <Build />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(mockGetServiceOptions).toHaveBeenCalledWith(2)
  })

  const quantityInput = screen.getByPlaceholderText(
    'Recommended +5 more than the build need for backup'
  ) as HTMLInputElement

  fireEvent.change(quantityInput, {
    target: { name: 'switchQuantity', value: '-1' },
  })

  expect(alertSpy).toHaveBeenCalledWith(
    'Switch quantity must be a positive number.'
  )
  expect(quantityInput.value).toBe('')

  alertSpy.mockRestore()
})
