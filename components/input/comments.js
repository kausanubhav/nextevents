import { useContext, useEffect, useState } from "react"

import CommentList from "./comment-list"
import NewComment from "./new-comment"
import classes from "./comments.module.css"
import NotificationContext from "../../store/notification-context"

function Comments(props) {
  const { eventId } = props

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
const [isFetching, setIsFetching] = useState(false);
  const notificationCtx = useContext(NotificationContext)

  useEffect(() => {
    if (showComments) {
      setIsFetching(true)
      fetch("/api/comments/" + eventId)
        .then((res) => res.json())
        .then((data) => {
          setComments(data.comments)
          setIsFetching(false)
        })
    }
  }, [showComments])

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus)
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: "Sending Comment",
      message: "Comment is being stored in database",
      status: "pending",
    })
    // send data to API
    fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }

        return res.json().then((data) => {
          throw new Error(data.message || "Something went wrong")
        })
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success",
          message: "Comment was added successfully",
          status: "success",
        })
      })
      .catch((err) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: err.message || "Something went wrong",
          status: "error",
        })
      })
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>{showComments ? "Hide" : "Show"} Comments</button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments &&!isFetching && <CommentList items={comments} />}
      {showComments && isFetching &&<p>Loading...</p>}
    </section>
  )
}

export default Comments
