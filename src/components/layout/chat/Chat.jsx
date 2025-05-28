"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  subscribeToMessages,
  subscribeToDisconnect,
} from "../../../services/chatServices"
import userService from "../../../services/userService"

const ChatPage = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [receiverId, setReceiverId] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const currentReceiverIdRef = useRef(receiverId)
  const messagesRef = useRef(messages)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const userData = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      return {
        token: user?.token,
        email: user?.email,
        id: user?.id,
      }
    } catch {
      return { token: null, email: null, id: null }
    }
  }, [])

  const { token, email: userEmail, id: currentUserId } = userData

  useEffect(() => {
    currentReceiverIdRef.current = receiverId
  }, [receiverId])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Auto-scroll only the messages container
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleIncomingMessage = useCallback(
    (incomingMsg) => {
      console.log("Incoming WebSocket message:", incomingMsg)

      const normalizedMsg = {
        id: incomingMsg.id || `ws-${Date.now()}-${Math.random()}`,
        content: incomingMsg.content,
        senderId: incomingMsg.senderId || incomingMsg.sender?.id,
        receiverId: incomingMsg.receiverId || incomingMsg.receiver?.id,
        timestamp: incomingMsg.timestamp || incomingMsg.createdAt || new Date().toISOString(),
        sender: incomingMsg.sender || (incomingMsg.senderId ? users.find((u) => u.id === incomingMsg.senderId) : null),
        receiver:
          incomingMsg.receiver || (incomingMsg.receiverId ? users.find((u) => u.id === incomingMsg.receiverId) : null),
      }

      const isRelevantToUser = normalizedMsg.senderId === currentUserId || normalizedMsg.receiverId === currentUserId

      if (isRelevantToUser) {
        const currentReceiver = currentReceiverIdRef.current
        const isForCurrentChat =
          currentReceiver &&
          ((normalizedMsg.senderId == currentUserId && normalizedMsg.receiverId == currentReceiver) ||
            (normalizedMsg.senderId == currentReceiver && normalizedMsg.receiverId == currentUserId))

        if (isForCurrentChat) {
          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
              (existingMsg) =>
                existingMsg.id === normalizedMsg.id ||
                (existingMsg.content === normalizedMsg.content &&
                  existingMsg.senderId === normalizedMsg.senderId &&
                  existingMsg.receiverId === normalizedMsg.receiverId &&
                  Math.abs(new Date(existingMsg.timestamp) - new Date(normalizedMsg.timestamp)) < 2000),
            )

            if (isDuplicate) {
              return prevMessages
            }

            const newMessages = [...prevMessages, normalizedMsg]
            return newMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          })
        }

        console.log("Message received for user:", normalizedMsg)
      }
    },
    [currentUserId, users],
  )

  useEffect(() => {
    if (!token) return

    let messageUnsubscribe, disconnectUnsubscribe

    const initializeConnection = async () => {
      try {
        await connectWebSocket(
          token,
          () => {
            setIsConnected(true)
            console.log("Chat WebSocket connected")
          },
          (error) => {
            console.error("WebSocket connection error:", error)
            setError("فشل في الاتصال. يرجى تحديث الصفحة.")
            setIsConnected(false)
          },
        )

        messageUnsubscribe = subscribeToMessages(handleIncomingMessage)

        disconnectUnsubscribe = subscribeToDisconnect(() => {
          setIsConnected(false)
        })
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error)
        setError("فشل في الاتصال بخدمة المحادثة.")
        setIsConnected(false)
      }
    }

    initializeConnection()

    return () => {
      messageUnsubscribe?.()
      disconnectUnsubscribe?.()
      disconnectWebSocket()
    }
  }, [token, handleIncomingMessage])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (receiverId && token) {
      fetchMessages(receiverId)
    } else {
      setMessages([])
    }
  }, [receiverId, token])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.getAll()
      const fetchedUsers = response.data || []
      const otherUsers = fetchedUsers.filter((user) => user.id !== currentUserId)
      setUsers(otherUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("فشل في تحميل المستخدمين. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (receiverId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/v1/messages/${receiverId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()

        const transformedMessages = (data || []).map((msg, index) => ({
          id: msg.id || `msg-${index}-${Date.now()}`,
          content: msg.content,
          senderId: msg.senderId || (msg.receiver?.id === currentUserId ? Number.parseInt(receiverId) : currentUserId),
          receiverId:
            msg.receiverId || (msg.receiver?.id === currentUserId ? currentUserId : Number.parseInt(receiverId)),
          timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
          sender:
            msg.sender ||
            (msg.receiver?.id === currentUserId
              ? users.find((u) => u.id === Number.parseInt(receiverId))
              : { id: currentUserId, email: userEmail }),
          receiver: msg.receiver || users.find((u) => u.id === Number.parseInt(receiverId)),
        }))

        const sortedMessages = transformedMessages.sort((a, b) => {
          const timeA = new Date(a.timestamp)
          const timeB = new Date(b.timestamp)
          return timeA - timeB
        })

        setMessages(sortedMessages)
      } else {
        console.error("Failed to fetch messages:", response.statusText)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const handleSendMessage = useCallback(() => {
    if (!receiverId) {
      alert("يرجى اختيار مستخدم لإرسال الرسالة إليه")
      return
    }

    if (!message.trim()) {
      return
    }

    if (!isConnected) {
      alert("غير متصل بخدمة المحادثة. يرجى الانتظار أو تحديث الصفحة.")
      return
    }

    const messageData = {
      receiverId: Number.parseInt(receiverId),
      content: message.trim(),
      senderId: currentUserId,
    }

    const success = sendMessage(messageData)
    if (success) {
      setMessage("")

      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: messageData.content,
        senderId: currentUserId,
        receiverId: Number.parseInt(receiverId),
        timestamp: new Date().toISOString(),
        sender: { email: userEmail, id: currentUserId },
      }

      setMessages((prev) => [...prev, optimisticMessage])
    } else {
      alert("فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.")
    }
  }, [receiverId, message, isConnected, currentUserId, userEmail])

  const isMyMessage = useCallback(
    (msg) => {
      if (msg.receiver?.id === currentUserId) {
        return false
      }

      if (msg.senderId === currentUserId) {
        return true
      }

      if (msg.receiver?.id && msg.receiver.id !== currentUserId) {
        return true
      }

      return false
    },
    [currentUserId],
  )

  const getMessageSenderName = useCallback(
    (msg) => {
      if (isMyMessage(msg)) {
        return "أنت"
      }

      if (msg.sender?.firstName) {
        return msg.sender.firstName
      }

      if (msg.sender?.email) {
        return msg.sender.email
      }

      if (msg.receiver?.id === currentUserId) {
        const sender = users.find((u) => u.id === Number.parseInt(receiverId))
        return sender?.firstName || sender?.email || "مستخدم غير معروف"
      }

      const sender = users.find((u) => u.id === msg.senderId)
      return sender?.firstName || sender?.email || "مستخدم غير معروف"
    },
    [isMyMessage, users, receiverId, currentUserId],
  )

  const selectedUser = useMemo(() => {
    return users.find((user) => user.id === Number.parseInt(receiverId))
  }, [users, receiverId])

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  const handleUserSelect = (userId) => {
    setReceiverId(userId)
  }

  const getUserInitials = (user) => {
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase()
    }
    return user.email.charAt(0).toUpperCase()
  }

  const getRoleColor = (role) => {
    if (!role) return "bg-neutral-100 text-neutral-600"
    const roleName = role.name?.replace("ROLE_", "").toLowerCase()
    switch (roleName) {
      case "admin":
        return "bg-primary-100 text-primary-700"
      case "donor":
        return "bg-accent-100 text-accent-700"
      case "recipient":
        return "bg-secondary-100 text-secondary-700"
      default:
        return "bg-neutral-100 text-neutral-600"
    }
  }

  const getRoleIcon = (role) => {
    if (!role) return null
    const roleName = role.name?.replace("ROLE_", "").toLowerCase()
    switch (roleName) {
      case "admin":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 20H6V18C6 16 10 14.9 12 14.9S18 16 18 18V20Z" />
          </svg>
        )
      case "donor":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9,2A7,7 0 0,0 2,9A7,7 0 0,0 9,16A7,7 0 0,0 16,9C16,5.36 13.09,2.5 9.5,2.03L9,2M9,4A5,5 0 0,1 14,9A5,5 0 0,1 9,14A5,5 0 0,1 4,9A5,5 0 0,1 9,4M9,5.5A3.5,3.5 0 0,0 5.5,9A3.5,3.5 0 0,0 9,12.5A3.5,3.5 0 0,0 12.5,9A3.5,3.5 0 0,0 9,5.5M16.5,17A1.5,1.5 0 0,0 15,18.5A1.5,1.5 0 0,0 16.5,20A1.5,1.5 0 0,0 18,18.5A1.5,1.5 0 0,0 16.5,17M14.5,19A1.5,1.5 0 0,0 13,20.5A1.5,1.5 0 0,0 14.5,22A1.5,1.5 0 0,0 16,20.5A1.5,1.5 0 0,0 14.5,19Z" />
          </svg>
        )
      case "recipient":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
          </svg>
        )
      default:
        return null
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    const firstName = user.firstName?.toLowerCase() || ""
    const email = user.email?.toLowerCase() || ""
    const role = user.role?.name?.replace("ROLE_", "").toLowerCase() || ""

    return firstName.includes(searchLower) || email.includes(searchLower) || role.includes(searchLower)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-90 to-neutral-100" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9,2A7,7 0 0,0 2,9A7,7 0 0,0 9,16A7,7 0 0,0 16,9C16,5.36 13.09,2.5 9.5,2.03L9,2M9,4A5,5 0 0,1 14,9A5,5 0 0,1 9,14A5,5 0 0,1 4,9A5,5 0 0,1 9,4M9,5.5A3.5,3.5 0 0,0 5.5,9A3.5,3.5 0 0,0 9,12.5A3.5,3.5 0 0,0 12.5,9A3.5,3.5 0 0,0 9,5.5M16.5,17A1.5,1.5 0 0,0 15,18.5A1.5,1.5 0 0,0 16.5,20A1.5,1.5 0 0,0 18,18.5A1.5,1.5 0 0,0 16.5,17M14.5,19A1.5,1.5 0 0,0 13,20.5A1.5,1.5 0 0,0 14.5,22A1.5,1.5 0 0,0 16,20.5A1.5,1.5 0 0,0 14.5,19Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800 font-kufi">منصة التبرع بالدم - المحادثات</h1>
                <p className="text-sm text-neutral-600 mt-1">تواصل مع المتبرعين والمحتاجين</p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-3 bg-neutral-60 px-4 py-2 rounded-full">
              <div
                className={`w-3 h-3 rounded-full shadow-inner ${isConnected ? "bg-primary-300 animate-pulse" : "bg-neutral-400"}`}
              ></div>
              <span className="text-sm font-medium text-neutral-700">{isConnected ? "متصل" : "غير متصل"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-primary-50 to-primary-100 border-r-4 border-primary-400 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-primary-800 font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-primary-500 hover:text-primary-800 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 h-fit">
              {/* Users Header */}
              <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-primary-300 to-primary-400 text-white rounded-t-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold font-kufi">المستخدمين المتاحين</h2>
                  <div className="flex items-center gap-2 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C20.4 14 24 15.8 24 18V20H8V18C8 15.8 11.6 14 16 14M8.5 11C10.4 11 12 9.4 12 7.5S10.4 4 8.5 4 5 5.6 5 7.5 6.6 11 8.5 11M8.5 13C5.3 13 0 14.6 0 17.8V20H6V18C6 16.9 6.5 15.3 8.5 13Z" />
                    </svg>
                    <span>{filteredUsers.length}</span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن مستخدم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 pl-10 placeholder-white placeholder-opacity-70 text-white focus:bg-white focus:text-neutral-800 focus:placeholder-neutral-400 focus:border-primary-300 focus:ring-4 focus:ring-primary-50 transition-all duration-200 font-cairo text-right"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white opacity-70"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z" />
                  </svg>
                </div>
              </div>

              {/* Users List */}
              <div className="max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-400 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-neutral-500 font-cairo">جاري التحميل...</p>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="p-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`p-4 m-2 rounded-xl cursor-pointer transition-all duration-200 border-2 hover:shadow-lg transform hover:scale-[1.02] ${
                          user.id === Number.parseInt(receiverId)
                            ? "bg-gradient-to-r from-primary-50 to-primary-100 border-primary-300 shadow-md"
                            : "bg-white border-neutral-200 hover:border-primary-200 hover:bg-primary-50"
                        }`}
                        onClick={() => handleUserSelect(user.id)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                                user.id === Number.parseInt(receiverId)
                                  ? "bg-gradient-to-br from-primary-300 to-primary-400"
                                  : "bg-gradient-to-br from-neutral-400 to-neutral-500"
                              }`}
                            >
                              {getUserInitials(user)}
                            </div>
                            {user.id === Number.parseInt(receiverId) && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-400 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-neutral-800 truncate font-kufi">
                                {user.firstName || user.email}
                              </h3>
                              {user.role?.name && (
                                <div
                                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                                >
                                  {getRoleIcon(user.role)}
                                  <span>{user.role.name.replace("ROLE_", "")}</span>
                                </div>
                              )}
                            </div>
                            {user.firstName && user.email && (
                              <p className="text-sm text-neutral-500 truncate font-cairo">{user.email}</p>
                            )}
                          </div>

                          {/* Chat Indicator */}
                          <div className="flex flex-col items-center gap-1">
                            <svg
                              className={`w-5 h-5 transition-colors ${
                                user.id === Number.parseInt(receiverId) ? "text-primary-500" : "text-neutral-400"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z" />
                            </svg>
                            {user.id === Number.parseInt(receiverId) && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C20.4 14 24 15.8 24 18V20H8V18C8 15.8 11.6 14 16 14M8.5 11C10.4 11 12 9.4 12 7.5S10.4 4 8.5 4 5 5.6 5 7.5 6.6 11 8.5 11M8.5 13C5.3 13 0 14.6 0 17.8V20H6V18C6 16.9 6.5 15.3 8.5 13Z" />
                      </svg>
                    </div>
                    <p className="text-neutral-500 font-kufi">
                      {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد مستخدمين متاحين"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
              {/* Chat Header */}
              {selectedUser && (
                <div className="p-6 bg-gradient-to-r from-primary-300 to-primary-400 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
                      {getUserInitials(selectedUser)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-kufi">{selectedUser.firstName || selectedUser.email}</h3>
                      <div className="flex items-center gap-2 text-primary-100 text-sm">
                        <div className="w-2 h-2 bg-primary-200 rounded-full animate-pulse"></div>
                        <span>نشط الآن</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div
                ref={messagesContainerRef}
                className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-neutral-50 to-white"
              >
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div
                        key={msg.id || index}
                        className={`flex ${isMyMessage(msg) ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isMyMessage(msg) ? "order-1" : "order-2"}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              isMyMessage(msg)
                                ? "bg-gradient-to-br from-primary-300 to-primary-400 text-white rounded-br-md"
                                : "bg-white text-neutral-800 border border-neutral-200 rounded-bl-md"
                            }`}
                          >
                            {!isMyMessage(msg) && (
                              <div className="text-xs text-neutral-500 mb-2 font-semibold">
                                {getMessageSenderName(msg)}
                              </div>
                            )}
                            <div className="text-sm leading-relaxed whitespace-pre-wrap font-cairo">{msg.content}</div>
                            {msg.timestamp && (
                              <div
                                className={`text-xs mt-2 ${isMyMessage(msg) ? "text-primary-100" : "text-neutral-400"}`}
                              >
                                {new Date(msg.timestamp).toLocaleTimeString("en-EG", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z" />
                        </svg>
                      </div>
                      <p className="text-neutral-500 text-lg font-kufi">
                        {receiverId ? "لا توجد رسائل بعد. ابدأ المحادثة!" : "اختر مستخدماً لبدء المحادثة"}
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 bg-white border-t border-neutral-100">
                <div className="flex gap-3">
                  <button
                    onClick={handleSendMessage}
                    disabled={!receiverId || !message.trim() || !isConnected}
                    className="bg-gradient-to-br from-primary-400 to-primary-500 text-white px-8 py-4 rounded-xl hover:from-primary-500 hover:to-primary-600 disabled:from-neutral-300 disabled:to-neutral-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <textarea
                      placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full border-2 border-neutral-200 rounded-xl p-4 focus:border-primary-300 focus:ring-4 focus:ring-primary-50 transition-all duration-200 resize-none font-cairo text-right"
                      rows="2"
                      disabled={!receiverId || !isConnected}
                    />
                  </div>
                </div>

                {!isConnected && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-primary-500 bg-primary-50 py-2 px-4 rounded-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      فقدان الاتصال. لا يمكن إرسال الرسائل حتى يتم الاتصال مرة أخرى.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
