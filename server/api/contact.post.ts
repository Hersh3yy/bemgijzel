export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, email, and message are required'
    })
  }

  // Validate email format
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format'
    })
  }

  // Get Zapier webhook URL from environment
  const webhookUrl = useRuntimeConfig().zapierWebhookUrl

  if (!webhookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Zapier webhook URL not configured'
    })
  }

  try {
    // Send to Zapier webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name.trim(),
        email: body.email.trim(),
        subject: body.subject || 'New Contact Form Submission from benjamingijzel.nl',
        message: body.message.trim(),
        timestamp: new Date().toISOString(),
        source: 'benjamingijzel.nl'
      })
    })

    if (!response.ok) {
      throw new Error(`Zapier webhook responded with status: ${response.status}`)
    }

    return { 
      success: true, 
      message: 'Email sent successfully!' 
    }
    
  } catch (error: any) {
    console.error('Error sending to Zapier webhook:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email. Please try again or contact directly.'
    })
  }
})
