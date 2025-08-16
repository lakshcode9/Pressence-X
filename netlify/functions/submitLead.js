// netlify/functions/submitLead.js
// Handle lead form submissions and store them in Airtable

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);
    const { name, email, instagram, package } = formData;

    // Validate required fields
    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and email are required' })
      };
    }

    // Get Airtable credentials from environment variables
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME || 'Lead Submissions';

    if (!airtableApiKey || !airtableBaseId) {
      console.error('Missing Airtable environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Prepare the data for Airtable
    const airtableData = {
      fields: {
        'Name': name,
        'Email': email,
        'Instagram': instagram || '',
        'Package Interest': package || '',
        'Submission Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        'Status': 'New'
      }
    };

    // Send data to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData)
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.text();
      console.error('Airtable API error:', errorData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save to database' })
      };
    }

    const airtableResult = await airtableResponse.json();

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Lead submitted successfully',
        recordId: airtableResult.id
      })
    };

  } catch (error) {
    console.error('Error submitting lead:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
