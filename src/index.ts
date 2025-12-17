import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { record } = await req.json() // This gets the updated user profile

  // Only send email if status is changed to approved
  if (record.approval_status === 'approved') {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'GSV Alumni <onboarding@resend.dev>',
        to: [record.email],
        subject: 'Welcome to GSVConnect! 🎓',
        html: `<strong>Hi ${record.full_name},</strong><p>Your account has been approved by the administrator. You can now log in and explore the AlumniVerse!</p><a href="https://your-site-url.com/login">Login Now</a>`,
      }),
    })

    return new Response(JSON.stringify({ message: "Email Sent" }), { status: 200 })
  }

  return new Response(JSON.stringify({ message: "No action taken" }), { status: 200 })
})