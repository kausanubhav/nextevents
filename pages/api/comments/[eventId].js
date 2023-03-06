import { getAllDocuments } from "../../../helpers/db-util"
import { connectDatabase, insertDocument } from "../../../helpers/db-util"

async function handler(req, res) {
  const eventId = req.query.eventId
  let client
  try {
    client = await connectDatabase()
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed" })
    return
  }

  //GET ALL COMMENTS
  if (req.method === "GET") {
    try {
      const documents =await getAllDocuments(client, 'comments', { _id: -1 },{eventId: eventId})
      res.status(200).json({ comments: documents })
    } catch (error) {
      res.status(500).json({ message: "Getting all comments failed" })
    }
    client.close()
  }

  //ADD COMMENT
  if (req.method === "POST") {
    const { email, name, text } = req.body

    if (
      !email ||
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input." })
      client.close()
      return
    }

    const newComment = {
      name,
      email,
      text,
      eventId,
    }
    try {
      const result = await insertDocument(client, "comments", newComment)
      newComment._id = result.insertedId
      res.status(201).json({ message: "Added comment.", comment: newComment })
    } catch (error) {
      res.status(500).json({ message: "Adding comment failed" })
    }
  }
  client.close()
}

export default handler
