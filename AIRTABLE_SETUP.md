# Airtable Integration Setup Guide

This guide will help you set up Airtable to store form responses from your Pressence360 website.

## Step 1: Create Airtable Base

1. Go to [airtable.com](https://airtable.com) and sign in/create account
2. Create a new base called "Pressence360 Leads"
3. Create a table called "Lead Submissions" with these fields:

| Field Name | Field Type | Options/Notes |
|------------|------------|----------------|
| Name | Single line text | Required |
| Email | Email | Required |
| Instagram | Single line text | Optional |
| Package Interest | Single select | Silver, Gold, Platinum, Black |
| Submission Date | Date | Auto-generated |
| Status | Single select | New, Contacted, Qualified, Closed |

## Step 2: Get API Credentials

1. Go to your Airtable account settings → API
2. Generate an API key (copy it)
3. Go to your base → Help → API documentation
4. Copy your Base ID (it looks like: `appXXXXXXXXXXXXXX`)

## Step 3: Set Environment Variables

### Option A: Netlify Dashboard (Recommended)
1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add these variables:
   - `AIRTABLE_API_KEY` = your_api_key_here
   - `AIRTABLE_BASE_ID` = your_base_id_here
   - `AIRTABLE_TABLE_NAME` = Lead Submissions

### Option B: Local Development
1. Create a `.env` file in your project root
2. Add the variables from the template above
3. Fill in your actual values

## Step 4: Test the Integration

1. Deploy your site to Netlify
2. Fill out the contact form on your website
3. Check your Airtable base to see if the submission appears
4. Check the browser console for any errors

## Step 5: Customize (Optional)

You can modify the `submitLead.js` function to:
- Add more fields
- Send email notifications
- Integrate with other services
- Add validation rules

## Troubleshooting

### Common Issues:

1. **"Missing Airtable environment variables"**
   - Check that your environment variables are set correctly in Netlify
   - Ensure variable names match exactly (case-sensitive)

2. **"Failed to save to database"**
   - Verify your API key is correct
   - Check that your base ID is correct
   - Ensure your table name matches exactly

3. **Form submits but no data in Airtable**
   - Check the Netlify function logs in your dashboard
   - Verify the field names in Airtable match the code

### Check Logs:
1. Go to your Netlify dashboard
2. Navigate to Functions → submitLead
3. Check the function logs for errors

## Security Notes

- Never commit your `.env` file to version control
- Your API key is secure in Netlify environment variables
- Consider setting up field validation in Airtable
- Monitor your API usage in Airtable

## Next Steps

Once working, you can:
- Set up Airtable automations for email notifications
- Create views to track lead status
- Export data for your CRM
- Set up reporting dashboards

Need help? Check the Airtable API documentation or contact support.
