# Airtable Embedded Form Setup (No Netlify Required!)

This is the EASIEST way to store form responses in Airtable - no coding, no Netlify functions needed!

## ✅ What You Get:
- Form responses automatically stored in Airtable
- No server setup required
- Professional looking form
- Instant setup

## 🚀 Quick Setup (5 minutes):

### Step 1: Create Airtable Base
1. Go to [airtable.com](https://airtable.com) and sign in
2. Create new base called "Pressence360 Leads"
3. Create table called "Lead Submissions"

### Step 2: Add Fields to Your Table
Add these columns:

| Field Name | Field Type | Options |
|------------|------------|---------|
| Name | Single line text | Required |
| Email | Email | Required |
| Instagram | Single line text | Optional |
| Package Interest | Single select | Silver, Gold, Platinum, Black |
| Submission Date | Date | Auto-generated |
| Status | Single select | New, Contacted, Qualified, Closed |

### Step 3: Create the Form
1. In your table, click "Form" view (top right)
2. Customize the form fields if needed
3. Click "Share form" → "Embed"
4. Copy the embed code

### Step 4: Update Your Website
1. Open `index.html`
2. Find this line:
   ```html
   src="https://airtable.com/embed/?backgroundColor=black&textColor=white"
   ```
3. Replace `YOUR_FORM_ID_HERE` with your actual form ID from Airtable

## 🎨 Customize the Form:

### Change Colors:
- `backgroundColor=black` → change to any color (e.g., `backgroundColor=#1a1a1a`)
- `textColor=white` → change to any color (e.g., `textColor=#ffd700`)

### Change Size:
- `width="100%"` → change to pixels (e.g., `width="600"`)
- `height="533"` → adjust height as needed

## 🔍 Find Your Form ID:

1. In Airtable, go to Form view
2. Click "Share form"
3. Copy the URL - it looks like:
   ```
   https://airtable.com/embed/appXXXXXXXXXXXXXX/shrYYYYYYYYYYYY
   ```
4. The part after `/embed/` is your form ID

## ✅ Test It:

1. Save your HTML file
2. Open your website
3. Fill out the form
4. Check your Airtable base - the submission should appear instantly!

## 🎯 Benefits:

- **Instant Setup**: No waiting for deployment
- **No Errors**: Airtable handles everything
- **Professional**: Looks great on your site
- **Secure**: Data goes directly to Airtable
- **Mobile Friendly**: Works on all devices

## 🚫 What You DON'T Need:

- Netlify functions
- Environment variables
- API keys
- Server setup
- JavaScript form handling

## 🔧 Troubleshooting:

**Form not showing?**
- Check that you replaced `YOUR_FORM_ID_HERE` with the real ID
- Make sure the iframe URL is correct

**Form looks wrong?**
- Adjust the `width` and `height` attributes
- Change colors with `backgroundColor` and `textColor`

**Submissions not appearing?**
- Check your Airtable base
- Make sure you're looking at the right table
- Refresh the page

## 🎉 You're Done!

That's it! Your form will now store all responses directly in Airtable without any backend setup.

Want to make it even better? You can:
- Set up email notifications in Airtable
- Create different views for your team
- Export data to other tools
- Set up automations

Need help? Airtable has great support and documentation!
