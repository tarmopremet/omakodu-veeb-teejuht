import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AjaxCloudRequest {
  action: 'open_relay' | 'get_status' | 'list_devices';
  hub_id?: string;
  relay_id?: string;
  device_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabaseServiceRole.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify user is admin
    const { data: userRole } = await supabaseServiceRole
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userRole || userRole.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { action, hub_id, relay_id, device_id }: AjaxCloudRequest = await req.json();

    // Get Ajax Cloud API credentials from site settings
    const { data: settings } = await supabaseServiceRole
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['ajax_cloud_email', 'ajax_cloud_password', 'ajax_cloud_app_id']);

    const settingsMap = settings?.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {} as Record<string, string>) || {};

    if (!settingsMap.ajax_cloud_email || !settingsMap.ajax_cloud_password) {
      throw new Error('Ajax Cloud credentials not configured');
    }

    console.log('Ajax action:', action, 'Hub:', hub_id, 'Relay:', relay_id);

    // In a real implementation, you would make API calls to Ajax Cloud here
    // For now, we'll simulate the responses
    
    let result;
    
    switch (action) {
      case 'open_relay':
        if (!hub_id || !relay_id) {
          throw new Error('Hub ID and Relay ID required for opening relay');
        }
        
        // Simulate Ajax Cloud API call to open relay
        console.log(`Opening relay ${relay_id} on hub ${hub_id}`);
        
        // Update locker status in database
        const { error: updateError } = await supabaseServiceRole
          .from('lockers')
          .update({
            status: 'open',
            last_opened_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('hub_id', hub_id)
          .eq('relay_id', relay_id);

        if (updateError) {
          console.error('Error updating locker status:', updateError);
        }

        // Log the action
        await supabaseServiceRole
          .from('open_logs')
          .insert({
            user_id: user.id,
            locker_id: null, // Will be filled by trigger if needed
            action: 'ajax_open_relay',
            meta: {
              hub_id,
              relay_id,
              ajax_integration: true,
              timestamp: new Date().toISOString()
            }
          });

        result = { 
          success: true, 
          message: `Relay ${relay_id} opened successfully`,
          hub_id,
          relay_id
        };
        break;

      case 'get_status':
        if (!hub_id) {
          throw new Error('Hub ID required for status check');
        }
        
        // Simulate Ajax Cloud API call to get hub status
        console.log(`Getting status for hub ${hub_id}`);
        
        result = {
          success: true,
          hub_id,
          status: 'online',
          devices: [
            { relay_id: 'A1', status: 'closed' },
            { relay_id: 'A2', status: 'open' },
            // Add more relays as needed
          ]
        };
        break;

      case 'list_devices':
        // Simulate Ajax Cloud API call to list all devices
        console.log('Listing all Ajax devices');
        
        result = {
          success: true,
          hubs: [
            {
              hub_id: 'HUB-001',
              name: 'Tartu Kapp',
              status: 'online',
              relays: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4']
            },
            {
              hub_id: 'HUB-002', 
              name: 'Tallinn Kapp',
              status: 'online',
              relays: ['C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4']
            }
          ]
        };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in ajax-integration function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});