import messageModel from "../dao/models/message.model.js";

class ChatController {
    static GetChat = async (req, res) => {
        const messages = await messageModel.find();
        res.send({
            status: "success",
            message: messages
        })
    }
    static PostChat = async (req, res) => {
        const {user, message}= req.body;
        if (!user || !message) {
            return res.status(400).send({
                status: "error",
                message: "Todos los campos son obligatorios"
            })
        }
        const messages = {
            user,
            message
        }
        const result = await messageModel.create(messages);
        res.send({
            status: "success",
            message: result
        })
    }
}

export { ChatController }