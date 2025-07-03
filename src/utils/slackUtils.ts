// Slack integration utilities
interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile?: {
    email?: string;
    display_name?: string;
  };
}

// Enhanced mock data with more realistic users
const mockSlackUsers: SlackUser[] = [
  { id: 'U123456', name: 'john.doe', real_name: 'John Doe', profile: { email: 'john.doe@growthjockey.com' } },
  { id: 'U234567', name: 'jane.smith', real_name: 'Jane Smith', profile: { email: 'jane.smith@growthjockey.com' } },
  { id: 'U345678', name: 'mike.johnson', real_name: 'Mike Johnson', profile: { email: 'mike.johnson@growthjockey.com' } },
  { id: 'U456789', name: 'sarah.wilson', real_name: 'Sarah Wilson', profile: { email: 'sarah.wilson@growthjockey.com' } },
  { id: 'U567890', name: 'david.brown', real_name: 'David Brown', profile: { email: 'david.brown@growthjockey.com' } },
  { id: 'U678901', name: 'lisa.davis', real_name: 'Lisa Davis', profile: { email: 'lisa.davis@growthjockey.com' } },
  { id: 'U789012', name: 'tom.miller', real_name: 'Tom Miller', profile: { email: 'tom.miller@growthjockey.com' } },
  { id: 'U890123', name: 'amy.garcia', real_name: 'Amy Garcia', profile: { email: 'amy.garcia@growthjockey.com' } },
  { id: 'U901234', name: 'robert.lee', real_name: 'Robert Lee', profile: { email: 'robert.lee@growthjockey.com' } },
  { id: 'U012345', name: 'emily.chen', real_name: 'Emily Chen', profile: { email: 'emily.chen@growthjockey.com' } },
];

export async function fetchSlackUsers(): Promise<SlackUser[]> {
  try {
    // Check if we have Slack credentials for production use
    const slackToken = import.meta.env.VITE_SLACK_BOT_TOKEN;
    
    if (slackToken && slackToken !== 'your_slack_bot_token') {
      // Production: Make actual Slack API call
      const response = await fetch('https://slack.com/api/users.list', {
        headers: {
          'Authorization': `Bearer ${slackToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          return data.members
            .filter((user: any) => !user.deleted && !user.is_bot && user.real_name)
            .map((user: any) => ({
              id: user.id,
              name: user.name,
              real_name: user.real_name || user.profile?.display_name || user.name,
              profile: user.profile,
            }));
        }
      }
    }
    
    // Fallback to mock data for development/demo
    console.log('[SLACK] Using mock data - configure VITE_SLACK_BOT_TOKEN for production');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return mockSlackUsers;
    
  } catch (error) {
    console.error('[SLACK] Error fetching users, falling back to mock data:', error);
    return mockSlackUsers;
  }
}

export async function sendSlackNotification(
  userId: string, 
  visitorName: string, 
  purpose: string
): Promise<boolean> {
  try {
    const slackToken = import.meta.env.VITE_SLACK_BOT_TOKEN;
    const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;
    
    const message = `👋 *Visitor Alert*\n\n*${visitorName}* is here to see you!\n\n📋 *Purpose:* ${purpose}\n🏢 *Location:* Reception\n⏰ *Time:* ${new Date().toLocaleTimeString()}\n\nPlease come to reception when convenient.`;
    
    if (slackToken && slackToken !== 'your_slack_bot_token') {
      // Production: Send actual Slack message
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${slackToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: userId,
          text: message,
          unfurl_links: false,
          unfurl_media: false,
        }),
      });
      
      const result = await response.json();
      if (result.ok) {
        console.log(`[SLACK] Message sent successfully to ${userId}`);
        return true;
      } else {
        console.error('[SLACK] Failed to send message:', result.error);
      }
    } else if (webhookUrl && webhookUrl !== 'your_slack_webhook_url') {
      // Alternative: Use webhook for general notifications
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          username: 'OttoHello Visitor System',
          icon_emoji: ':wave:',
        }),
      });
      
      if (response.ok) {
        console.log('[SLACK] Webhook notification sent successfully');
        return true;
      }
    }
    
    // Development/Demo mode
    console.log(`[SLACK DEMO] Would send to user ${userId}:`, message);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return true;
    
  } catch (error) {
    console.error('[SLACK] Error sending notification:', error);
    return false;
  }
}

// Utility function to find user by name (case-insensitive)
export function findSlackUserByName(users: SlackUser[], name: string): SlackUser | undefined {
  const searchName = name.toLowerCase().trim();
  
  return users.find(user => 
    user.real_name.toLowerCase() === searchName ||
    user.name.toLowerCase() === searchName ||
    user.profile?.display_name?.toLowerCase() === searchName ||
    user.profile?.email?.toLowerCase().includes(searchName)
  );
}

// Utility function to validate Slack configuration
export function isSlackConfigured(): boolean {
  const token = import.meta.env.VITE_SLACK_BOT_TOKEN;
  const webhook = import.meta.env.VITE_SLACK_WEBHOOK_URL;
  
  return (token && token !== 'your_slack_bot_token') || 
         (webhook && webhook !== 'your_slack_webhook_url');
}