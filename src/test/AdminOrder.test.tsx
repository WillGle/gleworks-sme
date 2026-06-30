// Covers dashboard-driven status filtering on the admin orders page.
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import AdminOrder from '@components/UserPage/AdminOrder'

const { mockListOrders } = vi.hoisted(() => ({
  mockListOrders: vi.fn(),
}))

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    listOrders: mockListOrders,
  }
})

test('applies the dashboard status query to the order list', async () => {
  mockListOrders.mockResolvedValue([
    {
      orderId: 'order-pending',
      createdAt: '2024-01-02T00:00:00.000Z',
      totalCost: 120000,
      paymentStatus: 'Pending',
      status: 'Pending',
      address: 'Pending Street',
      telephone: '0123',
      serviceName: 'Build',
      user: { firstName: 'Gleam', lastName: 'User' },
    },
    {
      orderId: 'order-finished',
      createdAt: '2024-01-03T00:00:00.000Z',
      totalCost: 150000,
      paymentStatus: 'Paid',
      status: 'Finished',
      address: 'Finished Street',
      telephone: '0999',
      serviceName: 'Switch',
      user: { firstName: 'Admin', lastName: 'User' },
    },
  ])

  render(
    <MemoryRouter initialEntries={['/admin/orders?status=Pending']}>
      <AdminOrder />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(screen.getByText('Pending Street')).toBeInTheDocument()
  })

  expect(screen.queryByText('Finished Street')).not.toBeInTheDocument()
})
