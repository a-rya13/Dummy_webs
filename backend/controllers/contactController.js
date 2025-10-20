import { Resend } from "resend";

export const contactUs = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Initialize Resend here, after dotenv has loaded
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "AdminPanel <onboarding@resend.dev>",
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Message from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    res.status(200).json({ message: "✅ Message sent successfully" });
  } catch (error) {
    console.error("❌ Error sending contact message:", error);
    res.status(500).json({
      message: "Server error while sending message",
      error: error.message,
    });
  }
};
