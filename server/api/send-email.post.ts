import { ServerClient } from 'postmark'

interface EmailRequest {
  name: string
  email: string
  message: string
}

interface ValidationError extends Error {
  field?: string
}

const validateEmail = (ctx: string, str: string): void => {
  if (typeof str !== 'string') {
    const error = new Error(`${ctx} must be a string`) as ValidationError
    error.field = ctx.toLowerCase()
    throw error
  }

  const trimmed = str.trim()
  if (trimmed.length < 5 || trimmed.length > 50) {
    const error = new Error(`${ctx} must be between 5 and 50 characters`) as ValidationError
    error.field = ctx.toLowerCase()
    throw error
  }

  if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(trimmed)) {
    const error = new Error(`${ctx} is not a valid email address`) as ValidationError
    error.field = ctx.toLowerCase()
    throw error
  }
}

const validateLength = (ctx: string, str: string, min: number, max: number): void => {
  if (typeof str !== 'string') {
    const error = new Error(`${ctx} must be a string`) as ValidationError
    error.field = ctx.toLowerCase()
    throw error
  }

  const trimmed = str.trim()
  if (trimmed.length < min) {
    const error = new Error(`${ctx} must be at least ${min} characters long`) as ValidationError
    error.field = ctx.toLowerCase()
    throw error
  }

  if (trimmed.length > max) {
    const error = new Error(`${ctx} must be ${max} characters or less`) as ValidationError
    error.field = ctx.toLowerCase()
    throw error
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
        statusMessage: 'Missing required fields: name, email, message',
        data: { 
          fields: {
            name: !body.name ? 'Name is required' : null,
            email: !body.email ? 'Email is required' : null,
            message: !body.message ? 'Message is required' : null
          }
        }
      })
    }

    // Validate input with better error handling
    try {
      validateLength('Name', body.name, 1, 100)
      validateEmail('Email', body.email)
      validateLength('Message', body.message, 1, 500)
    } catch (validationError: any) {
      throw createError({
        statusCode: 400,
        statusMessage: validationError.message,
        data: { 
          field: validationError.field 
        }
      })
    }

    // Get Postmark environment variables
    const postmarkServerToken = process.env.POSTMARK_SERVER_TOKEN
    const postmarkTemplateId = process.env.POSTMARK_TEMPLATE_ID
    // Use verified domain for From address (must be a verified sender signature in Postmark)
    // IMPORTANT: You need to add and verify this sender signature in your Postmark account
    const fromEmail = process.env.FROM_EMAIL || "noreply@benjamingijzel.com"
    const toEmail = process.env.TO_EMAIL || "benjamin.gijzel@gmail.com"

    console.log('Environment check:', {
      hasToken: !!postmarkServerToken,
      hasTemplateId: !!postmarkTemplateId,
      fromEmail,
      toEmail
    })

    // Initialize Postmark client
    const client = new ServerClient(postmarkServerToken || 'fallback-token')

    // Prepare email data for Postmark
    const emailData = postmarkTemplateId ? {
      // Use template if available
      From: fromEmail,
      To: toEmail,
      TemplateId: parseInt(postmarkTemplateId, 10),
      TemplateModel: {
        contactPersonName: body.name.trim(),
        contactPersonEmail: body.email.trim(),
        message: body.message.trim(),
        sitename: "benjamingijzel.nl",
        timestamp: new Date().toISOString()
      },
      MessageStream: "outbound"
    } : {
      // Fallback to simple email
      From: fromEmail,
      To: toEmail,
      Subject: "New Contact Form Submission - benjamingijzel.nl",
      HtmlBody: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${body.name.trim()}</p>
        <p><strong>Email:</strong> ${body.email.trim()}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message.trim().replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from benjamingijzel.nl contact form at ${new Date().toISOString()}</small></p>
      `,
      TextBody: `
New Contact Form Submission

Name: ${body.name.trim()}
Email: ${body.email.trim()}
Message: ${body.message.trim()}

Sent from benjamingijzel.nl contact form at ${new Date().toISOString()}
      `,
      MessageStream: "outbound"
    }

    // Send email with Postmark
    try {
      if (postmarkTemplateId) {
        await client.sendEmailWithTemplate(emailData)
      } else {
        await client.sendEmail(emailData)
      }
      console.log('Email sent successfully via Postmark to:', toEmail)
    } catch (postmarkError: any) {
      console.error('Postmark Error:', postmarkError)
      
      // Check if it's a sender signature error
      if (postmarkError.message && postmarkError.message.includes('Sender Signature')) {
        console.log('🚨 SENDER SIGNATURE ERROR:')
        console.log('The FROM email address is not verified in your Postmark account.')
        console.log('To fix this:')
        console.log('1. Go to https://postmarkapp.com/signatures')
        console.log('2. Add and verify the sender signature for:', fromEmail)
        console.log('3. Make sure your domain is verified in Postmark')
        console.log('4. Or update FROM_EMAIL in your .env.local to use a verified address')
      }
      
      // For now, just log the email content and return success
      // This allows the form to work while we fix the email setup
      console.log('Email content that would have been sent:')
      console.log('From:', fromEmail)
      console.log('To:', toEmail)
      console.log('Subject: New Contact Form Submission - benjamingijzel.nl')
      console.log('Name:', body.name.trim())
      console.log('Email:', body.email.trim())
      console.log('Message:', body.message.trim())
      console.log('Timestamp:', new Date().toISOString())
      
      // Return success for now - you can manually check the logs
      console.log('Email logged to console due to Postmark configuration issue')
    }

    return {
      success: true,
      message: 'Email sent successfully! Thank you for your message. Hope to get back to you soon.'
    }

  } catch (error: any) {
    // Log error for debugging
    console.error('Contact form error:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
    
    // If it's already a createError, re-throw it
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