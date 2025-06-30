import sgClient from '@sendgrid/mail'

interface EmailRequest {
  name: string
  email: string
  message: string
}

const validateEmail = (ctx: string, str: string) => {
  if (typeof str !== 'string') {
    throw new TypeError(`${ctx} must be a string`)
  }

  if (str.length < 5 || str.length > 50) {
    throw new TypeError(`${ctx} must be between 5 and 50 characters`)
  }

  if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(str)) {
    throw new TypeError(`${ctx} is not a valid email address`)
  }
}

const validateLength = (ctx: string, str: string, min: number, max: number) => {
  if (typeof str !== 'string') {
    throw new TypeError(`${ctx} must be a string`)
  }

  if (str.length < min) {
    throw new TypeError(`${ctx} must be at least ${min} characters long`)
  }

  if (str.length > max) {
    throw new TypeError(`${ctx} must be ${max} characters or less`)
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST requests
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Get request body
    const body: EmailRequest = await readBody(event)

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email, message'
      })
    }

    // Validate input
    validateLength('Name', body.name, 1, 100)
    validateEmail('Email', body.email)
    validateLength('Message', body.message, 1, 500)

    // Get environment variables
    const config = useRuntimeConfig()
    const sendGridApiKey = config.sendGridApiKey
    const sendGridTemplateId = config.sendGridTemplateId

    if (!sendGridApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'SendGrid API key not configured'
      })
    }

    if (!sendGridTemplateId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'SendGrid template ID not configured'
      })
    }

    // Set SendGrid API key
    sgClient.setApiKey(sendGridApiKey)

    // Prepare email data
    const emailData = {
      to: "benjamin.gijzel@gmail.com",
      from: "hiren@boldking.com", // This should be a verified sender in SendGrid
      templateId: sendGridTemplateId,
      subject: "benjamingijzel.nl email contactform",
      dynamic_template_data: {
        contactPersonName: body.name,
        contactPersonEmail: body.email,
        message: body.message,
        sitename: "benjamingijzel.nl"
      }
    }

    // Send email
    await sgClient.send(emailData)

    return {
      success: true,
      message: 'Email sent successfully'
    }

  } catch (error: any) {
    console.error('Email sending error:', error)
    
    // Handle SendGrid specific errors
    if (error.response) {
      console.error('SendGrid Error Response:', error.response.body)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send email via SendGrid'
      })
    }

    // Handle validation errors
    if (error.statusCode) {
      throw error
    }

    // Handle other errors
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'An unexpected error occurred'
    })
  }
}) 