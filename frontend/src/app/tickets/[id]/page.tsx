'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ticketsApi, messagesApi, suggestionsApi, agentsApi } from '@/lib/api'
import { Ticket, Message, SuggestedReply, AgentUser, TicketStatus, TicketPriority } from '@/types'
import { format } from 'date-fns'

export default function TicketDetailPage() {
  const params = useParams()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [suggestions, setSuggestions] = useState<SuggestedReply[]>([])
  const [agents, setAgents] = useState<AgentUser[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [generatingSuggestion, setGeneratingSuggestion] = useState(false)
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    loadTicket()
    loadAgents()
  }, [ticketId])

  const loadTicket = async () => {
    try {
      setLoading(true)
      const response = await ticketsApi.getOne(ticketId)
      setTicket(response.data)
      setMessages(response.data.messages || [])
      setSuggestions(response.data.suggestedReplies || [])
    } catch (error) {
      console.error('Failed to load ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAgents = async () => {
    try {
      const response = await agentsApi.getAll()
      setAgents(response.data)
    } catch (error) {
      console.error('Failed to load agents:', error)
    }
  }

  const handleGenerateSuggestion = async () => {
    try {
      setGeneratingSuggestion(true)
      const response = await suggestionsApi.generate(ticketId)
      setSuggestions([response.data, ...suggestions])
    } catch (error) {
      console.error('Failed to generate suggestion:', error)
      alert('Failed to generate suggestion. Please try again.')
    } finally {
      setGeneratingSuggestion(false)
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) return

    try {
      setSendingReply(true)
      await messagesApi.create({
        ticketId,
        fromRole: 'agent',
        body: replyText,
      })
      setReplyText('')
      await loadTicket() // Reload to get updated messages
    } catch (error) {
      console.error('Failed to send reply:', error)
      alert('Failed to send reply. Please try again.')
    } finally {
      setSendingReply(false)
    }
  }

  const handleUseSuggestion = (suggestionText: string) => {
    setReplyText(suggestionText)
  }

  const handleUpdateTicket = async (updates: Partial<Ticket>) => {
    try {
      await ticketsApi.update(ticketId, updates)
      await loadTicket()
    } catch (error) {
      console.error('Failed to update ticket:', error)
      alert('Failed to update ticket. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Loading ticket...</div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Ticket not found</div>
          <Link href="/tickets" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Back to tickets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link href="/tickets" className="text-blue-600 hover:text-blue-800">
          ← Back to tickets
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{ticket.subject}</h1>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {ticket.status}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {ticket.priority}
                </span>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.fromRole === 'user'
                      ? 'bg-gray-50'
                      : message.fromRole === 'agent'
                      ? 'bg-blue-50'
                      : 'bg-yellow-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">
                      {message.fromRole === 'user' && (
                        <span>
                          {message.fromName || message.fromEmail || 'Customer'}
                        </span>
                      )}
                      {message.fromRole === 'agent' && <span>Support Agent</span>}
                      {message.fromRole === 'system' && <span>System</span>}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(message.createdAt), 'PPp')}
                    </div>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">{message.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Box */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reply</h2>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  AI Suggested Replies
                </h3>
                <div className="space-y-2">
                  {suggestions.slice(0, 2).map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-purple-600 font-medium">
                          {suggestion.model}
                        </span>
                        <button
                          onClick={() => handleUseSuggestion(suggestion.suggestionText)}
                          className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Use this
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {suggestion.suggestionText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateSuggestion}
              disabled={generatingSuggestion}
              className="mb-4 w-full sm:w-auto px-4 py-2 border border-purple-600 rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingSuggestion ? 'Generating...' : '✨ Suggest Reply'}
            </button>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your reply here..."
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() || sendingReply}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingReply ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) =>
                    handleUpdateTicket({ status: e.target.value as TicketStatus })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) =>
                    handleUpdateTicket({ priority: e.target.value as TicketPriority })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to
                </label>
                <select
                  value={ticket.assignedTo || ''}
                  onChange={(e) =>
                    handleUpdateTicket({ assignedTo: e.target.value || undefined })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <div className="mb-2">
                    <span className="font-medium">Created:</span>{' '}
                    {format(new Date(ticket.createdAt), 'PPp')}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span>{' '}
                    {format(new Date(ticket.updatedAt), 'PPp')}
                  </div>
                </div>
              </div>

              {ticket.inboxChannel && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Channel</div>
                    <div className="text-gray-500">
                      {ticket.inboxChannel.name || ticket.inboxChannel.type}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
