'use client'

import { useEffect, useState } from 'react'
import { agentsApi, channelsApi } from '@/lib/api'
import { AgentUser, InboxChannel, AgentRole, ChannelType } from '@/types'

export default function AdminPage() {
  const [agents, setAgents] = useState<AgentUser[]>([])
  const [channels, setChannels] = useState<InboxChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'agents' | 'channels'>('agents')

  // Agent form state
  const [showAgentForm, setShowAgentForm] = useState(false)
  const [agentForm, setAgentForm] = useState({
    name: '',
    email: '',
    role: 'agent' as AgentRole,
  })

  // Channel form state
  const [showChannelForm, setShowChannelForm] = useState(false)
  const [channelForm, setChannelForm] = useState({
    name: '',
    type: 'email' as ChannelType,
    addressOrConfigJson: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [agentsRes, channelsRes] = await Promise.all([
        agentsApi.getAll(),
        channelsApi.getAll(),
      ])
      setAgents(agentsRes.data)
      setChannels(channelsRes.data)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await agentsApi.create(agentForm)
      setShowAgentForm(false)
      setAgentForm({ name: '', email: '', role: 'agent' })
      await loadData()
    } catch (error) {
      console.error('Failed to create agent:', error)
      alert('Failed to create agent. Please try again.')
    }
  }

  const handleDeleteAgent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    try {
      await agentsApi.delete(id)
      await loadData()
    } catch (error) {
      console.error('Failed to delete agent:', error)
      alert('Failed to delete agent. Please try again.')
    }
  }

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await channelsApi.create(channelForm)
      setShowChannelForm(false)
      setChannelForm({ name: '', type: 'email', addressOrConfigJson: '' })
      await loadData()
    } catch (error) {
      console.error('Failed to create channel:', error)
      alert('Failed to create channel. Please try again.')
    }
  }

  const handleDeleteChannel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this channel?')) return
    try {
      await channelsApi.delete(id)
      await loadData()
    } catch (error) {
      console.error('Failed to delete channel:', error)
      alert('Failed to delete channel. Please try again.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('agents')}
            className={`${
              activeTab === 'agents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Agents
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`${
              activeTab === 'channels'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Channels
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Agents</h2>
                <button
                  onClick={() => setShowAgentForm(!showAgentForm)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {showAgentForm ? 'Cancel' : 'Add Agent'}
                </button>
              </div>

              {showAgentForm && (
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create New Agent
                  </h3>
                  <form onSubmit={handleCreateAgent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={agentForm.name}
                        onChange={(e) =>
                          setAgentForm({ ...agentForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={agentForm.email}
                        onChange={(e) =>
                          setAgentForm({ ...agentForm, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={agentForm.role}
                        onChange={(e) =>
                          setAgentForm({ ...agentForm, role: e.target.value as AgentRole })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Create Agent
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {agents.map((agent) => (
                    <li key={agent.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-gray-500">{agent.email}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {agent.role}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                agent.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {agent.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="px-3 py-1 border border-red-600 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                  {agents.length === 0 && (
                    <li className="px-6 py-8 text-center text-gray-500">
                      No agents found. Create your first agent to get started.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Channels Tab */}
          {activeTab === 'channels' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Channels</h2>
                <button
                  onClick={() => setShowChannelForm(!showChannelForm)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {showChannelForm ? 'Cancel' : 'Add Channel'}
                </button>
              </div>

              {showChannelForm && (
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create New Channel
                  </h3>
                  <form onSubmit={handleCreateChannel} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={channelForm.name}
                        onChange={(e) =>
                          setChannelForm({ ...channelForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Support Email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={channelForm.type}
                        onChange={(e) =>
                          setChannelForm({
                            ...channelForm,
                            type: e.target.value as ChannelType,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="email">Email</option>
                        <option value="web_form">Web Form</option>
                        <option value="widget">Chat Widget</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {channelForm.type === 'email'
                          ? 'Email Address'
                          : 'Configuration (JSON)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={channelForm.addressOrConfigJson}
                        onChange={(e) =>
                          setChannelForm({
                            ...channelForm,
                            addressOrConfigJson: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={
                          channelForm.type === 'email'
                            ? 'support@example.com'
                            : '{"key": "value"}'
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Create Channel
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {channels.map((channel) => (
                    <li key={channel.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {channel.name || channel.type}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {channel.addressOrConfigJson}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {channel.type}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                channel.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {channel.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteChannel(channel.id)}
                          className="px-3 py-1 border border-red-600 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                  {channels.length === 0 && (
                    <li className="px-6 py-8 text-center text-gray-500">
                      No channels found. Create your first channel to start receiving tickets.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
