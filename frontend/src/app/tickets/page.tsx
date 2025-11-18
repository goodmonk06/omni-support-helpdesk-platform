'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ticketsApi } from '@/lib/api'
import { Ticket, TicketStatus, TicketPriority, TicketStats } from '@/types'
import { formatDistanceToNow } from 'date-fns'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<TicketStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{
    status?: TicketStatus
    priority?: TicketPriority
  }>({})

  useEffect(() => {
    loadTickets()
    loadStats()
  }, [filters])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const response = await ticketsApi.getAll(filters)
      setTickets(response.data)
    } catch (error) {
      console.error('Failed to load tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await ticketsApi.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500">Total</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.total}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500">Open</div>
                  <div className="mt-1 text-3xl font-semibold text-green-600">
                    {stats.open}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500">Pending</div>
                  <div className="mt-1 text-3xl font-semibold text-yellow-600">
                    {stats.pending}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500">Closed</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-600">
                    {stats.closed}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as TicketStatus | undefined,
                  })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={filters.priority || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priority: e.target.value as TicketPriority | undefined,
                  })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({})}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading tickets...</div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <div className="text-gray-500">No tickets found</div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="block hover:bg-gray-50 transition"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-blue-600 truncate">
                          {ticket.subject}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority}
                          </span>
                          {ticket.assignedAgent && (
                            <span className="text-sm text-gray-500">
                              Assigned to: {ticket.assignedAgent.name}
                            </span>
                          )}
                        </div>
                        {ticket.messages && ticket.messages.length > 0 && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {ticket.messages[0].body}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 text-sm text-gray-500">
                        {formatDistanceToNow(new Date(ticket.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
