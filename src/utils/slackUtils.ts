// Slack integration utilities
// Note: This is a mock implementation. In production, you would need:
// 1. A Slack app with proper OAuth tokens
// 2. A backend service to handle Slack API calls securely
// 3. Environment variables for Slack credentials

interface SlackUser {
  id: string;
  name: string;
  real_name: string;
}

// Mock Slack users - replace with actual Slack API call
const mockSlackUsers: SlackUser[] = [
  { id: 'U123456', name: 'john.doe', real_name: 'John Doe' },
  { id: 'U234567', name: 'jane.smith', real_name: 'Jane Smith' },
  { id: 'U345678', name: 'mike.johnson', real_name: 'Mike Johnson' },
  { id: 'U456789', name: 'sarah.wilson', real_name: 'Sarah Wilson' },
  { id: 'U567890', name: 'david.brown', real_name: 'David Brown' },
  { id: 'U678901', name: 'lisa.davis', real_name: 'Lisa Davis' },
  { id: 'U789012', name: 'tom.miller', real_name: 'Tom Miller' },
  { id: 'U890123', name: 'amy.garcia', real_name: 'Amy Garcia' },
];

export async function fetchSlackUsers(): Promise<SlackUser[]> {
  // In production, this would make an actual API call to Slack
  // Example: GET https://slack.com/api/users.list
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockSlackUsers;
}

export async function sendSlackNotification(
  userId: string, 
  visitorName: string, 
  purpose: string
): Promise<void> {
  // In production, this would send a DM via Slack API
  // Example: POST https://slack.com/api/chat.postMessage
  
  const message = `👋 Hi! You have a visitor: **${visitorName}** is here to see you.\n\n📋 Purpose: ${purpose}\n\n🏢 Please come to reception when convenient.`;
  
  console.log(`[SLACK NOTIFICATION] Sending to user ${userId}:`, message);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, you would handle the actual Slack API response here
  console.log(`[SLACK NOTIFICATION] Successfully sent to ${userId}`);
}

// Production implementation would look like this:
/*
export async function fetchSlackUsers(): Promise<SlackUser[]> {
  const response = await fetch('/api/slack/users', {
    headers: {
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Slack users');
  }
  
  const data = await response.json();
  return data.members.filter(user => !user.deleted && !user.is_bot);
}

export async function sendSlackNotification(
  userId: string, 
  visitorName: string, 
  purpose: string
): Promise<void> {
  const message = `👋 Hi! You have a visitor: **${visitorName}** is here to see you.\n\n📋 Purpose: ${purpose}\n\n🏢 Please come to reception when convenient.`;
  
  const response = await fetch('/api/slack/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel: userId,
      text: message,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send Slack notification');
  }
}
*/