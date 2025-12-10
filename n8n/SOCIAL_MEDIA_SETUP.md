# Social Media Integration Setup Guide

This guide will help you set up WhatsApp, Instagram, and Messenger integrations for your Tsukai chatbot using the provided n8n workflows.

## Prerequisites

- n8n instance running (local or cloud)
- Turso database configured
- Google Gemini API key
- Facebook Developer account

---

## 1. WhatsApp Business API Setup

### Step 1: Create Facebook Business Account
1. Go to [business.facebook.com](https://business.facebook.com)
2. Click "Create Account" and follow the prompts
3. Verify your business

### Step 2: Set Up WhatsApp Business API
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Select "Business" as app type
4. Add "WhatsApp" product to your app
5. Navigate to WhatsApp → Getting Started
6. Add a phone number or use the test number provided

### Step 3: Get Access Token
1. In WhatsApp settings, find "Temporary Access Token"
2. Copy this token (valid for 24 hours)
3. For production, generate a permanent token:
   - Go to "System Users" in Business Settings
   - Create a system user
   - Generate token with `whatsapp_business_messaging` permission

### Step 4: Configure Webhook in n8n
1. Import `whatsapp-workflow.json` into n8n
2. Open the "WhatsApp Webhook" node
3. Copy the webhook URL (e.g., `https://your-n8n.com/webhook/whatsapp-webhook`)
4. In Facebook Developer Console:
   - Go to WhatsApp → Configuration
   - Click "Edit" next to Webhook
   - Paste your webhook URL
   - Enter a verify token (any string, remember it)
   - Subscribe to `messages` events

### Step 5: Configure Credentials in n8n
1. Create HTTP Header Auth credential:
   - Name: `WhatsApp Access Token`
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_ACCESS_TOKEN`
2. Create Turso credential with your database URL and token
3. Create Google Gemini API credential

### Step 6: Test
1. Activate the workflow in n8n
2. Send a message to your WhatsApp Business number
3. Check n8n execution log for successful processing
4. Verify response is sent back

---

## 2. Instagram DM Integration

### Step 1: Create Instagram Business Account
1. Convert your Instagram account to Business Account:
   - Settings → Account → Switch to Professional Account
2. Connect to a Facebook Page

### Step 2: Set Up Instagram Messaging
1. In Facebook Developer Console (same app or new):
2. Add "Instagram" product
3. Go to Instagram → Basic Display
4. Create Instagram App ID

### Step 3: Get Access Token
1. Go to Instagram → Basic Display → User Token Generator
2. Click "Generate Token"
3. Log in with your Instagram account
4. Authorize the app
5. Copy the access token

### Step 4: Configure Webhook
1. Import `instagram-workflow.json` into n8n
2. Copy the webhook URL from the "Instagram Webhook" node
3. In Developer Console:
   - Go to Instagram → Configuration
   - Add webhook URL
   - Subscribe to `messages` and `messaging_postbacks`

### Step 5: Configure Credentials
1. Create OAuth2 credential for Instagram:
   - Authorization URL: `https://api.instagram.com/oauth/authorize`
   - Access Token URL: `https://api.instagram.com/oauth/access_token`
   - Paste your access token
2. Use same Turso and Gemini credentials

### Step 6: Test
1. Activate workflow
2. Send a DM to your Instagram Business account
3. Verify response

---

## 3. Facebook Messenger Integration

### Step 1: Create Facebook Page
1. Go to [facebook.com/pages/create](https://facebook.com/pages/create)
2. Create a page for your business
3. Complete page setup

### Step 2: Add Messenger Product
1. In Facebook Developer Console (same app):
2. Add "Messenger" product
3. Go to Messenger → Settings

### Step 3: Generate Page Access Token
1. In Messenger Settings, find "Access Tokens"
2. Select your Facebook Page
3. Click "Generate Token"
4. Copy the token

### Step 4: Configure Webhook
1. Import `messenger-workflow.json` into n8n
2. Copy webhook URL
3. In Messenger Settings → Webhooks:
   - Click "Add Callback URL"
   - Paste webhook URL
   - Enter verify token
   - Subscribe to: `messages`, `messaging_postbacks`, `messaging_optins`

### Step 5: Configure Credentials
1. Create OAuth2 credential for Messenger:
   - Use the Page Access Token
2. Use same Turso and Gemini credentials

### Step 6: Test
1. Activate workflow
2. Send message to your Facebook Page
3. Verify bot responds

---

## 4. Database Schema Updates

Add these columns to your `conversations` table if not present:

```sql
ALTER TABLE conversations ADD COLUMN channel TEXT DEFAULT 'web';
ALTER TABLE conversations ADD COLUMN channel_user_id TEXT;
ALTER TABLE conversations ADD COLUMN channel_username TEXT;
CREATE INDEX idx_conversations_channel ON conversations(channel, channel_user_id);
```

Add metadata column to `messages` table:

```sql
ALTER TABLE messages ADD COLUMN metadata TEXT;
```

---

## 5. Environment Variables

Add these to your `.env` file:

```bash
# WhatsApp
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Instagram
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
INSTAGRAM_PAGE_ID=your_instagram_page_id

# Messenger
MESSENGER_PAGE_ACCESS_TOKEN=your_messenger_token
MESSENGER_PAGE_ID=your_facebook_page_id

# Webhook Verification
WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

---

## 6. Workflow Customization

### Adjusting AI Responses
Edit the "Generate AI Response" node in each workflow:
- **Temperature**: 0.7 (lower = more consistent, higher = more creative)
- **Max Tokens**: Adjust response length
- **Prompt**: Customize the AI's personality and behavior

### Adding Quick Replies (Messenger)
Modify the "Send Messenger Reply" node:

```json
{
  "recipient": { "id": "{{ $json.senderId }}" },
  "message": {
    "text": "{{ $json.response }}",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Yes",
        "payload": "yes"
      },
      {
        "content_type": "text",
        "title": "No",
        "payload": "no"
      }
    ]
  }
}
```

### Adding Media Support (WhatsApp)
Handle image/document messages in the "Parse WhatsApp Message" node:

```javascript
const message = change.value.messages[0];
let messageText = '';
let mediaUrl = null;

if (message.type === 'text') {
  messageText = message.text.body;
} else if (message.type === 'image') {
  mediaUrl = message.image.url;
  messageText = message.image.caption || '[Image received]';
}

return { ...existingData, messageText, mediaUrl };
```

---

## 7. Monitoring & Debugging

### Check Workflow Executions
1. In n8n, go to "Executions"
2. Filter by workflow name
3. Click on execution to see detailed logs

### Common Issues

**Webhook not receiving messages:**
- Verify webhook URL is publicly accessible
- Check webhook subscriptions in Facebook Developer Console
- Ensure verify token matches

**401 Unauthorized errors:**
- Regenerate access token
- Check token hasn't expired
- Verify token has correct permissions

**Database errors:**
- Check Turso credentials
- Verify database schema is up to date
- Check SQL query syntax

**AI not responding:**
- Verify Gemini API key is valid
- Check API quota limits
- Review prompt formatting

---

## 8. Production Deployment

### Security Best Practices
1. **Use HTTPS** for all webhook URLs
2. **Validate webhook signatures** (add verification node)
3. **Rate limiting** to prevent abuse
4. **Store tokens securely** (use n8n credentials, not hardcoded)

### Scaling Considerations
1. **Enable workflow queue** in n8n for high traffic
2. **Add error handling** nodes for failed API calls
3. **Implement retry logic** for transient failures
4. **Monitor execution times** and optimize slow queries

### Webhook Signature Verification

Add this node after the webhook trigger:

```javascript
// For WhatsApp/Messenger/Instagram
const crypto = require('crypto');
const signature = $input.item.headers['x-hub-signature-256'];
const payload = JSON.stringify($input.item.json);
const expectedSignature = 'sha256=' + crypto
  .createHmac('sha256', process.env.APP_SECRET)
  .update(payload)
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Invalid signature');
}

return $input.item.json;
```

---

## 9. Testing Checklist

- [ ] WhatsApp: Send text message → Receive AI response
- [ ] WhatsApp: Verify conversation logged in database
- [ ] Instagram: Send DM → Receive response
- [ ] Instagram: Reply to story → Bot responds
- [ ] Messenger: Send message → Receive response
- [ ] Messenger: Test quick replies (if implemented)
- [ ] All: Check conversation history persists
- [ ] All: Verify RAG retrieves relevant knowledge
- [ ] All: Test with multiple concurrent users

---

## 10. Next Steps

1. **Customize AI personality** for each channel
2. **Add handoff to human** when AI can't help
3. **Implement analytics** tracking
4. **Set up automated testing**
5. **Create admin dashboard** for monitoring

---

## Support

For issues or questions:
- n8n Documentation: [docs.n8n.io](https://docs.n8n.io)
- WhatsApp API Docs: [developers.facebook.com/docs/whatsapp](https://developers.facebook.com/docs/whatsapp)
- Instagram API Docs: [developers.facebook.com/docs/instagram](https://developers.facebook.com/docs/instagram)
- Messenger API Docs: [developers.facebook.com/docs/messenger-platform](https://developers.facebook.com/docs/messenger-platform)
