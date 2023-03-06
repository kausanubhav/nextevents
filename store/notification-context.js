import { createContext, useEffect, useState } from "react"

//defines the structre of the context
const NotificationContext = createContext({
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
})
export function NotificationContextProvider(props) {
  //manage context related states
  const [activeNotification, setActiveNotification] = useState()

  useEffect(() => {
    if (
      activeNotification && activeNotification?.status === "success" ||
      activeNotification?.status === "error"
    ) {
        const timer=setTimeout(() => {
            setActiveNotification(null)
        },3000)

        return ()=>{
            clearTimeout(timer)
        }
    }
  }, [activeNotification])

  function showNotificationHandler(notificationData) {
    setActiveNotification(notificationData)
  }
  function hideNotificationHandler() {
    setActiveNotification(null)
  }

  const context = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  }

  return (
    <NotificationContext.Provider value={context}>{props.children}</NotificationContext.Provider>
  )
}

export default NotificationContext
